/* eslint-disable no-console */
'use strict';

// core
const fs = require('fs');
const path = require('path');

// modules
const R = require('ramda');
const babel = require('@babel/core');
const {
  copyFile,
  isDir,
  isFile,
  mkdirp,
  readDir,
  readFile,
  writeFile,
} = require('funk-fs');

// local
const config = require('../build.config');
const pkg = require('../package.json');


/* eslint-disable no-process-env */
const { NODE_ENV } = process.env;
/* eslint-enable no-process-env */

const transpileFile = async (src, dist, opts) => {
  if (!isFile(src, fs)) throw Error(`${ src } is not a file`);
  
  const input = await readFile(src, fs);
  const { code: output } = await babel.transformAsync(input, config(opts));
  const { dir: distDir } = path.parse(dist);
  
  // ensure dir exists before writing file to it
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
    const absDist = path.join(dist, file);
    
    if (await isDir(absPath, fs)) {
      await transpileDir(absPath, absDist, opts);
    } else if (/\.js$/.test(absPath)) {
      await transpileFile(absPath, absDist, opts);
    } else {
      console.log('not transpiling', file);
    }
  }
  
};

const stripPkg = R.omit(['devDependencies', 'nyc']);
const toHumanJSON = json => JSON.stringify(json, null, 2);


(async () => {
  
  const ignore = [
    // test files
    /[.]test[.]js$/,
    // hidden files
    /^[.]/,
  ];
  const env = NODE_ENV;
  const root = path.join(__dirname, '..');
  const src = path.join(root, './src');
  
  const dist = path.join(root, './dist');
  const esDist = path.join(dist, 'es');
  const cjsDist = path.join(dist, 'cjs');
  
  const opts = { env, ignore };
  
  // transpile multiple targets in parallel
  await Promise.all([
    transpileDir(src, esDist, { ...opts, node: false })
      .then(async _ => {
        const pack = stripPkg(pkg);
        
        await writeFile(toHumanJSON(pack), path.join(esDist, 'package.json'), fs);
        await copyFile(path.join(root, 'README.md'), path.join(esDist, 'README.md'), fs);
      })
      .catch(err => console.error('Error transpiling es', err)),
    transpileDir(src, cjsDist, { ...opts, node: pkg.engines.node })
      .then(async _ => {
        const pack = stripPkg(pkg);
        pack.name = `${ pack.name }-cjs`;
        
        await writeFile(toHumanJSON(pack), path.join(cjsDist, 'package.json'), fs);
        await copyFile(path.join(root, 'README.md'), path.join(cjsDist, 'README.md'), fs);
      })
      .catch(err => console.error('Error transpiling cjs', err)),
  ]);
  
})();
