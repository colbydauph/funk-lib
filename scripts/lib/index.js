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
const config = require('../../build.config');

const toHumanJSON = json => JSON.stringify(json, null, 2);
const map = R.curry((fn, arr) => Promise.all(arr.map(item => fn(item))));
const juxt = fns => async (...args) => map(f => f(...args), fns);

const stripPkg = R.omit(['devDependencies', 'nyc']);

const transpileFile = async (src, dist, opts) => {
  if (!isFile(src, fs)) throw Error(`${ src } is not a file`);
    
  const input = await readFile(src, fs);
  const { code: output } = await babel.transformAsync(input, {
    ...config(opts),
    filename: dist,
  });
  const { dir: distDir } = path.parse(dist);
  
  // ensure dir exists before writing file to it
  await mkdirp(distDir, fs);
  await writeFile(output, dist, fs);
};

const transpileDir = R.curry(async (src, dist, opts) => {
  
  if (!await isDir(src)) throw Error(`${ src } is not a dir`);
  
  const files = (await readDir(src, fs)).filter(file => {
    return !opts.ignore.some(reg => reg.test(file));
  });
  
  if (!files.length) return; // console.log(`ignoring ${ src }`);
  
  for (const file of files) {
    const absPath = path.join(src, file);
    const absDist = path.join(dist, file);
    
    if (await isDir(absPath, fs)) {
      await transpileDir(absPath, absDist, opts);
    } else if (/\.js$/.test(absPath)) {
      await transpileFile(absPath, absDist, opts);
    } else {
      console.log('not transpiling: ', file);
    }
  }
  
});

const copyOtherFiles = R.curry(async (src, dist, fs) => {
  return map(file => copyFile(
    path.join(src, file),
    path.join(dist, file),
    fs,
  ), ['README.md', 'LICENSE']);
});

module.exports = {
  copyOtherFiles,
  juxt,
  stripPkg,
  toHumanJSON,
  transpileDir,
};
