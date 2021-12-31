'use strict';

// core
const fs = require('fs');
const path = require('path');

// modules
const { readDirSync, isDirSync } = require('funk-fs');
const { expect } = require('chai');

const SRC = path.resolve(__dirname, '../src');

describe('src', () => {
  
  const index = require(SRC);
  
  readDirSync(SRC, fs)
    .filter(file => {
      // ignore "internal" modules
      if (file.startsWith('_')) return false;
      return isDirSync(path.join(SRC, file), fs);
    })
    .forEach(module => {
      
      it(`should export the ${ module } module`, () => {
        expect(index[module]).to.eql(
          require(path.join(SRC, module)),
        );
      });
      
    });
    
});
