'use strict';

// modules
const { expect } = require('chai');

// local
const {
  random,
} = require('..');

describe('number lib', () => {
  
  describe('random', () => {
    
    it('should generate a number between min and max', () => {
      [...Array(1000)]
        .forEach(() => {
          const num = random(0, 100);
          expect(num >= 0).to.eql(true);
          expect(num <= 100).to.eql(true);
        });
    });
    
    it('should use inclusive bounds', () => {
      const nums = [...Array(1000)]
        .map(() => random(0, 2))
        .filter((num) => num !== 1);
      expect(nums.length).to.be.greaterThan(1);
    });
  
  });
  
});
