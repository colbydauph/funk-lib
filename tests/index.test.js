'use strict';

// modules
const { expect } = require('chai');

// local
const index = require('..');

const MODULES = [
  'async',
  'color',
  'crypto',
  'datetime',
  'is',
  'object',
  'process',
  'stream',
  'string',
  'uuid',
];

describe('index', () => {
  
  MODULES.forEach((module) => {
    it(`should export the ${ module } module`, () => {
      expect(index[module]).to.eql(require(`../${ module }`));
    });
  });
    
});
