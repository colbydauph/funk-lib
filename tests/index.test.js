/* eslint-disable no-sync */
'use strict';

// core
const fs = require('fs');
const path = require('path');

// modules
const { expect } = require('chai');
const R = require('ramda');

// local
const index = require('../src');

const IGNORE = R.test(/^\.|coverage|test|node_modules/);
const SRC = path.resolve(__dirname, '../src');

const MODULES = fs
  .readdirSync(SRC)
  .filter(R.complement(IGNORE))
  .filter((file) => (
    fs
      .statSync(path.join(SRC, file))
      .isDirectory()
  ));
  
describe('index', () => {
  
  MODULES.forEach((module) => {
    it(`should export the ${ module } module`, () => {
      expect(index[module]).to.eql(require(`../src/${ module }`));
    });
  });
    
});
