'use strict';

// modules
// const sinon = require('sinon');
const R = require('ramda');
const { expect } = require('chai');

// local
const {
  dropSync,
  flatMapSync,
  filterSync,
  // fromArraySync,
  nextSync,
  rangeSync,
  reduceSync,
  takeSync,
  toArraySync,
} = require('..');

describe('iterator', () => {
  
  let pred, iterator, output;
  beforeEach('stub', () => {
    pred = R.identity;
    iterator = rangeSync(0, 5);
    output = [0, 1, 0, 2, 1, 0, 3, 2, 1, 0];
  });
  
  describe('dropSync', () => {
    
    it('should drop n items', () => {
      expect(toArraySync(dropSync(3, iterator))).to.eql([3, 4]);
    });
    
    it('should be curried', () => {
      expect(toArraySync(dropSync(3)(iterator))).to.eql([3, 4]);
    });
    
  });
  
  describe('filterSync', () => {
    
    beforeEach('stub', () => {
      pred = num => num < 8;
      iterator = rangeSync(0, 20);
      output = [0, 1, 2, 3, 4, 5, 6, 7];
    });
    
    it('should only yield items that pass the predicate', async () => {
      expect(toArraySync(filterSync(pred, iterator)))
        .to.eql(output);
    });
    
    it('should be curried', () => {
      expect(toArraySync(filterSync(pred)(iterator)))
        .to.eql(output);
    });
            
  });
      
  describe('flatMapSync', () => {
    
    beforeEach('stub', () => {
      pred = function* pred(num) {
        while (num--) yield num;
      };
    });
    
    it('should yield all yielded items from predicate', async () => {
      expect(toArraySync(flatMapSync(pred, iterator)))
        .to.eql(output);
    });
    
    it('should be curried', () => {
      expect(toArraySync(flatMapSync(pred)(iterator)))
        .to.eql(output);
    });
            
  });
  
  describe('nextSync', () => {
    
    it('should return the next value in the iterator', () => {
      const yields = [
        nextSync(iterator),
        nextSync(iterator),
        nextSync(iterator),
        nextSync(iterator),
      ];
      expect(yields).to.eql([0, 1, 2, 3]);
    });
    
    it('should return the next value in the iterator', () => {
      expect(nextSync(iterator)).to.eql(0);
    });
    
  });
  
  describe('rangeSync', () => {
    
    it('should create an iterable of numbers with inclusive start and exclusive end', () => {
      expect(toArraySync(rangeSync(0, 10))).to.eql(R.range(0, 10));
    });
    
    it('should work with infinite sequences', () => {
      const len = 100;
      const infinite = rangeSync(0, Infinity);
      const first = takeSync(len, infinite);
      expect(toArraySync(first)).to.eql(R.range(0, len));
    });
    
    it('should be curried', () => {
      expect(toArraySync(rangeSync(0)(10))).to.eql(R.range(0, 10));
    });
    
  });
  
  describe('reduceSync', () => {
    
    beforeEach('stub', () => {
      pred = (acc, num) => acc + num;
      iterator = rangeSync(0, 200);
      output = 19900;
    });
    
    it('should reduce iterable into accumulator', async () => {
      expect(reduceSync(pred, 0, iterator))
        .to.eql(output);
    });
    
    it('should be curried', () => {
      expect(reduceSync(pred)(0)(iterator))
        .to.eql(output);
    });
            
  });
  
});
