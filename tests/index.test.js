'use strict';

// modules
const { expect } = require('chai');

// local
const index = require('..');

const asyncModule = require('../async');
const objectModule = require('../object');
const streamModule = require('../stream');
const stringModule = require('../string');
const cryptoModule = require('../crypto');
const datetimeModule = require('../datetime');

describe('index', () => {
  
  it('should export the async module', () => {
    expect(index.async).to.eql(asyncModule);
  });
  
  it('should export the crypto module', () => {
    expect(index.crypto).to.eql(cryptoModule);
  });
  
  it('should export the datetime module', () => {
    expect(index.datetime).to.eql(datetimeModule);
  });
  
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
