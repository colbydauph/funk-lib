/* eslint-disable no-console */

// core
const fs = require('fs');
const path = require('path');

// modules
const babel = require('@babel/core');
const {
  isDir,
  isFile,
  mkdirp,
  readDir,
  readFile,
  writeFile,
} = require('funk-fs');

// local
const config = require('./babel-config.js');

const transpileFile = async (src, dist, opts) => {
  if (!isFile(src, fs)) throw Error(`${ src } is not a file`);
  
  const input = await readFile(src, fs);
  const { code: output } = await babel.transformAsync(input, config(opts));
  const { dir: distDir } = path.parse(dist);
  
  await mkdirp(distDir, fs);
  await writeFile(output, dist, fs);
};

// eslint-disable-next-line
const transpileDir = async (src, dist, opts) => {
  
  if (!await isDir(src)) throw Error(`${ src } is not a dir`);
  
  const files = (await readDir(src, fs)).filter((file) => {
    return !opts.ignore.some(reg => reg.test(file));
  });
  
  if (!files.length) return console.log(`ignoring ${ src }`);
  
  for (const file of files) {
    const absPath = path.join(src, file);
    if (await isDir(absPath, fs)) {
      await transpileDir(absPath, path.join(dist, file), opts);
    } else if (/\.js$/.test(absPath)) {
      await transpileFile(absPath, path.join(dist, file), opts);
    } else {
      console.log('not transpiling', file);
    }
  }
  
};

(async () => {
  
  const ignore = [
    /[.]test[.]js$/,
    /^[.]/,
  ];
  const env = 'production';
  const src = 'src';
  
  await Promise.all([
    transpileDir(
      path.join(__dirname, src),
      path.join(__dirname, 'dist/es'),
      { env, ignore, node: false },
    ),
    transpileDir(
      path.join(__dirname, src),
      path.join(__dirname, 'dist/cjs'),
      { env, ignore, node: true },
    ),
  ]);
  
})();


