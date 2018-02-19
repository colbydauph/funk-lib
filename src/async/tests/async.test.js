'use strict';

// modules
const { expect } = require('chai');
const sinon = require('sinon');
const R = require('ramda');

// local
const {
  filter,
  flatMap,
  forEach,
  map,
  reduce,
} = require('..');

describe('async lib', () => {
  
  describe('forEach', () => {
    
    it('should call predicate once for each item in iterable', async () => {
      const pred = sinon.stub();
      await forEach(pred, [1, 2, 3, 4, 5]);
      expect(pred.callCount).to.eql(5);
    });
    
    it('should call predicate with value', async () => {
      const pred = sinon.stub();
      const arr = ['some-item-a', 'some-item-b'];
      await forEach(pred, arr);
      expect(pred.args.map(R.head)).to.eql(arr);
    });
    
    it('should return the iterable', async () => {
      const iterable = [1, 2, 3, 4, 5];
      const result = await forEach((el) => el, iterable);
      expect(result).to.equal(iterable);
    });
    
    it('should be curried', async () => {
      const stub = sinon.stub();
      await forEach(stub)([1, 2, 3, 4, 5]);
      expect(stub.callCount).to.eql(5);
    });
    
  });
  
  describe('map', () => {
    
    it('should call predicate once for each item in iterable', async () => {
      const pred = sinon.stub();
      await map(pred, [1, 2, 3, 4, 5]);
      expect(pred.callCount).to.eql(5);
    });
    
    it('should call predicate with value', async () => {
      const pred = sinon.stub();
      const arr = ['some-item-a', 'some-item-b'];
      await map(pred, arr);
      expect(pred.args.map(R.head)).to.eql(arr);
    });
    
    it('should return an iterable with the mapped contents', async () => {
      const pred = (char) => `${ char }-1`;
      const arr = ['a', 'b', 'c'];
      const result = await map(pred, arr);
      expect(result).to.eql(['a-1', 'b-1', 'c-1']);
    });
    
    it('should be curried', async () => {
      const pred = sinon.stub();
      await map(pred)([1, 2, 3, 4, 5]);
      expect(pred.callCount).to.eql(5);
    });
    
  });
  
  describe('filter', () => {
    
    let pred;
    beforeEach('stub', () => {
      pred = sinon.spy((num) => num % 2);
    });
    
    it('should call predicate once for each item in iterable', async () => {
      await filter(pred, [1, 2, 3, 4, 5]);
      expect(pred.callCount).to.eql(5);
    });
    
    it('should call predicate with iterable element', async () => {
      const iterable = [{}, {}, {}];
      await filter(pred, iterable);
      pred.args.forEach(([arg], i) => {
        expect(arg).to.eql(iterable[i]);
      });
    });
    
    it('should return a filtered iterable', async () => {
      const result = await filter(pred, [1, 2, 3, 4, 5]);
      expect(result).to.eql([1, 3, 5]);
    });
    
    it('should be curried', async () => {
      const result = await filter(pred)([1, 2, 3, 4, 5]);
      expect(result).to.eql([1, 3, 5]);
    });
    
  });
  
  describe('flatMap', () => {
    
    let pred;
    beforeEach('stub', () => {
      pred = sinon.spy((num) => [num, num + 1]);
    });
    
    it('should call predicate once for each item in iterable', async () => {
      await flatMap(pred, [1, 2, 3, 4, 5]);
      expect(pred.callCount).to.eql(5);
    });
    
    it('should call predicate with iterable element', async () => {
      const iterable = [{}, {}, {}];
      await flatMap(pred, iterable);
      pred.args.forEach(([arg], i) => {
        expect(arg).to.eql(iterable[i]);
      });
    });
    
    it('should return concatenated results', async () => {
      const result = await flatMap(pred, [1, 2, 3]);
      expect(result).to.eql([1, 2, 2, 3, 3, 4]);
    });
    
    it('should be curried', async () => {
      const result = await flatMap(pred)([1]);
      expect(result).to.eql([1, 2]);
    });

  });
  
  describe('reduce', () => {
    
    let pred, iterable, init;
    beforeEach('stub', () => {
      pred = sinon.spy((sum, num) => (sum + num));
      iterable = [1, 2, 3, 4, 5];
      init = 10;
    });
    
    let result;
    beforeEach('call', async () => {
      result = await reduce(pred, init, iterable);
    });
    
    it('should call predicate once for each item in iterable', async () => {
      expect(pred.callCount).to.eql(5);
    });
    
    it('should call predicate with accumulator and element', async () => {
      expect(pred.args.map(R.head)).to.eql([10, 11, 13, 16, 20]);
      expect(pred.args.map(R.nth(1))).to.eql(iterable);
    });
    
    it('should return the final accumulator value', async () => {
      expect(result).to.eql(25);
    });
    
    it('should work with any iterable', async () => {
      const obj = {
        * [Symbol.iterator]() {
          yield 2;
          yield 4;
          yield 6;
        },
      };
      const result = await reduce(pred, init, obj);
      expect(result).to.eql(22);
    });
    
    it('should be curried', async () => {
      const result = await reduce(pred)(init)(iterable);
      expect(result).to.eql(25);
    });
    
  });
    
});
