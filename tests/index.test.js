'use strict';

// modules
const { expect } = require('chai');

// local
const index = require('..');

const objectModule = require('../src/object');
const streamModule = require('../src/stream');
const stringModule = require('../src/string');

describe('index', () => {
  
  it('should export the object module', () => {
    expect(index.object).to.eql(objectModule);
  });
  
  it('should export the stream module', () => {
    expect(index.stream).to.eql(streamModule);
  });
  
  it('should export the string module', () => {
    expect(index.string).to.eql(stringModule);
  });
  
});
