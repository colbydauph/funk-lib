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


// eslint-disable-next-line max-statements
(async () => {
  
  const BROWSER_DEST = './dist/es';
  const NODE_DEST = './dist/cjs';
  const POLYFILL_SRC = path.join(__dirname, '../polyfills');

  const POLYFILLS = {
    BROWSER: {
      util: `${ BROWSER_DEST }/_polyfills/util`,
    },
    NODE: {
      // util: `${ NODE_DEST }/_polyfills/util`,
    },
  };
  
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
    
    // browser target
    Promise.resolve({
      ...opts,
      node: false,
      alias: {
        ...POLYFILLS.BROWSER,
        [pkg.name]: BROWSER_DEST,
      },
    })
      .then(juxt([
        // transpile source
        transpileDir(src, esDist),
        // transpile polyfills
        transpileDir(
          path.join(POLYFILL_SRC, '/browser'),
          path.join(esDist, '/_polyfills'),
        ),
      ]))
      .then(R.tap(_ => console.log(`Transpiled browser dist from ${ src } to ${ esDist }`)))
      .then(_ => {
        const pack = { ...stripPkg(pkg), name: `${ pkg.name }-es` };
        
        return juxt([
          writeFile(toHumanJSON(pack), path.join(esDist, 'package.json')),
          copyOtherFiles(root, esDist),
        ])(fs);
      })
      .catch(err => console.error('Error transpiling browser dist (ESM)', err)),
    
    // node target
    Promise.resolve({
      ...opts,
      node: pkg.engines.node,
      alias: {
        ...POLYFILLS.NODE,
        [pkg.name]: NODE_DEST,
      },
    })
      .then(juxt([
        // transpile source
        transpileDir(src, cjsDist),
        // transpile polyfills
        transpileDir(
          path.join(POLYFILL_SRC, '/node'),
          path.join(cjsDist, '/_polyfills'),
        ),
      ]))
      .then(R.tap(_ => console.log(`Transpiled node dist from ${ src } to ${ cjsDist }`)))
      .then(_ => {
        const pack = stripPkg(pkg);
        
        return juxt([
          writeFile(toHumanJSON(pack), path.join(cjsDist, 'package.json')),
          copyOtherFiles(root, cjsDist),
        ])(fs);
      })
      .catch(err => console.error('Error transpiling node dist (CJS)', err)),
  ]);
  
})();
