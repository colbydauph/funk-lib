/* eslint-disable no-console */
'use strict';

// core
const fs = require('fs');
const path = require('path');

// modules
const R = require('ramda');
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
const config = require('../build.config');


const transpileFile = async (src, dist, opts) => {
  if (!isFile(src, fs)) throw Error(`${ src } is not a file`);
  
  const input = await readFile(src, fs);
  const { code: output } = await babel.transformAsync(input, config(opts));
  const { dir: distDir } = path.parse(dist);
  
  await mkdirp(distDir, fs);
  await writeFile(output, dist, fs);
};


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
  
  const pkg = require('../package.json');
  
  const ignore = [
    /[.]test[.]js$/,
    /^[.]/,
  ];
  const env = 'production';
  const src = '../src';
  const dist = '../dist';
  
  const esDist = path.join(__dirname, path.join(dist, 'es'));
  const cjsDist = path.join(__dirname, path.join(dist, 'cjs'));
  
  await Promise.all([
    transpileDir(
      path.join(__dirname, src),
      esDist,
      { env, ignore, node: false },
    ).then(_ => {
      const pack = R.omit(['devDependencies', 'nyc'], pkg);
      return writeFile(JSON.stringify(pack, null, 2), path.join(esDist, 'package.json'), fs);
    }),
    transpileDir(
      path.join(__dirname, src),
      cjsDist,
      { env, ignore, node: pkg.engines.node },
    ).then(_ => {
      const pack = R.omit(['devDependencies', 'nyc'], pkg);
      pack.name = `${ pack.name }-cjs`;
      return writeFile(JSON.stringify(pack, null, 2), path.join(cjsDist, 'package.json'), fs);
    }),
  ]);
  
  
})();
