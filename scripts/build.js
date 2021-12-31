/* eslint-disable no-console, no-process-exit */
'use strict';

// core
const fs = require('fs');
const path = require('path');

// modules
const R = require('ramda');
const { writeFile } = require('funk-fs');

// local
const pkg = require('../package.json');
const {
  copyOtherFiles,
  juxt,
  stripPkg,
  toHumanJSON,
  transpileDir,
} = require('./lib');


const {
  NODE_ENV,
  /* eslint-disable-next-line no-process-env */
} = process.env;


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


// eslint-disable-next-line max-statements
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
      .catch(err => {
        console.error('Error transpiling browser dist (ESM)', err);
        process.exit(1);
      }),
    
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
      .catch(err => {
        console.error('Error transpiling node dist (CJS)', err);
        process.exit(1);
      }),
  ]);
  
})();
