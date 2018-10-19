'use strict';

// modules
const R = require('ramda');
const { expect } = require('chai');

// local
const {
  on,
} = require('..');

describe('function lib', () => {
  
  describe('on', () => {
    
    it('should apply unary func to each argument and pass results to binary func', () => {
      const binary = R.add;
      const unary = R.prop('total');
      const left = { total: 100 };
      const right = { total: 75 };
      expect(on(binary, unary, left, right)).to.eql(175);
    });
    
    it('should be curried', () => {
      const binary = R.add;
      const unary = R.prop('total');
      const left = { total: 100 };
      const right = { total: 75 };
      expect(on(binary)(unary)(left)(right)).to.eql(175);
    });
    
  });
  
});
