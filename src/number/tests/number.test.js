// modules
import { expect } from 'chai';

import { isInteger, isFloat } from 'funk-lib/is';

// local
import {
  random,
  randomFloat,
} from '..';

describe('number lib', () => {
  
  describe('random', () => {
    
    it('should generate an integer between min and max', () => {
      [...Array(1000)]
        .forEach(() => {
          const num = random(0, 100);
          
          expect(num).to.satisfy(isInteger);
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
    
    it('should floor min to MIN_SAFE_INTEGER', () => {
      expect(random(-Infinity, 0)).to.satisfy((n) => {
        return Number.isFinite(n) && n <= 0 && n >= Number.MIN_SAFE_INTEGER;
      });
    });
    
    it('should ceil max to MAX_SAFE_INTEGER', () => {
      expect(random(0, Infinity)).to.satisfy((n) => {
        return Number.isFinite(n) && n >= 0 && n <= Number.MAX_SAFE_INTEGER;
      });
    });
  
  });
  
  describe('randomFloat', () => {
    
    it('should generate a float between min and max', () => {
      [...Array(1000)]
        .forEach(() => {
          const num = randomFloat(0, 100);
          
          expect(num).to.satisfy(isFloat, num);
          expect(num >= 0).to.eql(true, num);
          expect(num <= 100).to.eql(true, num);
        });
    });
    
    it('should use inclusive bounds', () => {
      const nums = [...Array(1000)]
        .map(() => randomFloat(0, 2))
        .filter((num) => num !== 1);
      expect(nums.length).to.be.greaterThan(1);
    });
    
    it('should floor min to MIN_SAFE_INTEGER', () => {
      expect(randomFloat(-Infinity, 0)).to.satisfy((n) => {
        return Number.isFinite(n) && n <= 0 && n >= Number.MIN_SAFE_INTEGER;
      });
    });
    
    it('should ceil max to MAX_SAFE_INTEGER', () => {
      expect(randomFloat(0, Infinity)).to.satisfy((n) => {
        return Number.isFinite(n) && n >= 0 && n <= Number.MAX_SAFE_INTEGER;
      });
    });
  
  });
  
});
