'use strict';

// modules
const R = require('ramda');
const sinon = require('sinon');
const { expect } = require('chai');

// local
const {
  on,
  once,
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
  
  describe('once', () => {
    
    it('should only call func on first call', () => {
      const func = sinon.stub().callsFake((one, two) => one + two + 3);
      const onced = once(func);
      
      expect(onced(1, 2)).to.eql(6);
      
      [...Array(10)].forEach(_ => {
        // returns cached value
        expect(onced(1, 2)).to.eql(6);
        expect(func.callCount).to.eql(1);
      });
      
    });
    
  });
  
});
