'use strict';

// modules
const R = require('ramda');
const { expect } = require('chai');

// local
const {
  accumulate,
  concat,
  cycle,
  drop,
  dropWhile,
  enumerate,
  // every,
  // exhaust,
  filter,
  // find,
  flatMap,
  // forEach,
  frame,
  fromArray,
  // includes,
  // indexOf,
  length,
  // map,
  next,
  nth,
  range,
  reduce,
  // repeat,
  // repeatSync,
  // reverse,
  slice,
  // some,
  sum,
  take,
  // takeWhile,
  times,
  toArray,
  unique,
  zip,
} = require('../sync');

describe('iterable/sync', () => {
  
  let pred, arr, iterator, expected;
  beforeEach(() => {
    pred = R.identity;
    arr = R.range(0, 5);
    iterator = fromArray(arr);
    expected = [0, 1, 0, 2, 1, 0, 3, 2, 1, 0];
  });
  
  describe('accumulate', () => {
    
    beforeEach(() => {
      pred = R.add;
    });
    
    it('should yield accumulated items', () => {
      expect(toArray(accumulate(pred, iterator)))
        .to.eql([0, 1, 3, 6, 10]);
    });
    
    it('should be curried', () => {
      expect(toArray(accumulate(pred)(iterator)))
        .to.eql([0, 1, 3, 6, 10]);
    });
    
    it('should work with arrays', () => {
      expect(toArray(accumulate(pred)(arr)))
        .to.eql([0, 1, 3, 6, 10]);
    });
    
  });
  
  describe('concat', () => {
    
    let iterators;
    beforeEach(() => {
      iterators = [
        range(0, 10),
        range(10, 20),
      ];
      expected = R.range(0, 20);
    });
    
    it('should concat iterators', () => {
      expect(toArray(concat(...iterators)))
        .to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(toArray(concat([1, 2, 3], [4, 5, 6])))
        .to.eql([1, 2, 3, 4, 5, 6]);
    });
    
    it('should be curried', () => {
      expect(toArray(concat(iterators[0])(iterators[1])))
        .to.eql(expected);
    });
    
  });
  
  describe('cycle', () => {
    
    beforeEach(() => {
      expected = [
        ...R.range(0, 5),
        ...R.range(0, 5),
        ...R.range(0, 5),
        ...R.range(0, 2),
      ];
    });
    
    it('should infinitely cycle through the iterator', () => {
      iterator = R.pipe(cycle, take(17))(iterator);
      expect(toArray(iterator)).to.eql(expected);
    });
    
    it('should work with arrays', () => {
      iterator = R.pipe(cycle, take(17))(arr);
      expect(toArray(iterator)).to.eql(expected);
    });
    
  });
  
  describe('drop', () => {
    
    it('should drop n items', () => {
      expect(toArray(drop(3, iterator))).to.eql([3, 4]);
    });
    
    it('should work with arrays', () => {
      expect(toArray(drop(3, arr))).to.eql([3, 4]);
    });
    
    it('should be curried', () => {
      expect(toArray(drop(3)(iterator))).to.eql([3, 4]);
    });
    
  });
  
  // todo: test for predicate flipping pass / fail
  describe('dropWhile', () => {
    
    beforeEach(() => {
      arr = R.range(0, 100);
      iterator = fromArray(arr);
      pred = n => n < 70;
      expected = R.range(70, 100);
    });
    
    it('should drop items while the predicate is satisfied', () => {
      expect(toArray(dropWhile(pred, iterator))).to.eql(expected);
    });
    
    it('work with arrays', () => {
      expect(toArray(dropWhile(pred, arr))).to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(dropWhile(pred)(iterator))).to.eql(expected);
    });
    
  });
  
  describe('enumerate', () => {
    
    beforeEach(() => {
      arr = R.range(10, 20);
      iterator = fromArray(arr);
      expected = toArray(zip(
        range(10, 20),
        range(0, 10),
      ));
    });
    
    it('should yield [item, index] tuples', () => {
      expect(toArray(enumerate(iterator)))
        .to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(toArray(enumerate(arr)))
        .to.eql(expected);
    });
    
  });
  
  describe('filter', () => {
    
    beforeEach(() => {
      pred = num => num < 8;
      arr = R.range(0, 20);
      iterator = fromArray(arr);
      expected = [0, 1, 2, 3, 4, 5, 6, 7];
    });
    
    it('should only yield items that pass the predicate', async () => {
      expect(toArray(filter(pred, iterator)))
        .to.eql(expected);
    });
    
    it('should work with arrays', async () => {
      expect(toArray(filter(pred, arr)))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(filter(pred)(iterator)))
        .to.eql(expected);
    });
            
  });
      
  describe('flatMap', () => {
    
    beforeEach(() => {
      pred = function* pred(num) {
        while (num--) yield num;
      };
      arr = R.range(0, 5);
      iterator = fromArray(arr);
      expected = [0, 1, 0, 2, 1, 0, 3, 2, 1, 0];
    });
    
    it('should yield all yielded items from predicate', async () => {
      expect(toArray(flatMap(pred, iterator)))
        .to.eql(expected);
    });
    
    it('should work with arrays', () => {
      pred = (num) => [num, num + 1];
      expect(toArray(flatMap(pred, arr)))
        .to.eql([0, 1, 1, 2, 2, 3, 3, 4, 4, 5]);
    });
    
    it('should be curried', () => {
      expect(toArray(flatMap(pred)(iterator)))
        .to.eql(expected);
    });
            
  });
  
  describe('frame', () => {
    
    beforeEach(() => {
      arr = R.range(0, 10);
      iterator = fromArray(arr);
      expected = [
        [0, 1, 2],
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 5],
        [4, 5, 6],
        [5, 6, 7],
        [6, 7, 8],
        [7, 8, 9],
      ];
    });
    
    it('should yield sliding frames of size n', () => {
      expect(toArray(frame(3)(iterator))).to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(toArray(frame(3)(arr))).to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(frame(3)(iterator))).to.eql(expected);
    });
    
  });
  
  describe('length', () => {
    
    it('should return the iterator length', () => {
      expect(length(iterator)).to.eql(5);
    });
    
    it('should work with arrays', () => {
      expect(length(arr)).to.eql(5);
    });
    
    it('should exhaust the iterator', () => {
      length(iterator);
      expect(toArray(iterator)).to.eql([]);
    });
    
  });
  
  describe('next', () => {
    
    it('should return the next value in the iterator', () => {
      const yields = [
        next(iterator),
        next(iterator),
        next(iterator),
        next(iterator),
      ];
      expect(yields).to.eql([0, 1, 2, 3]);
    });
    
    it('should return the next value in the iterator', () => {
      expect(next(iterator)).to.eql(0);
    });
    
    it('should advance the iterator', () => {
      next(iterator);
      expect(toArray(iterator)).to.eql([1, 2, 3, 4]);
    });
    
    it('should throw ? if the iterator is exhausted');
    
  });
  
  describe('nth', () => {
    
    beforeEach(() => {
      arr = R.range(100, 1000);
      iterator = fromArray(arr);
    });
    
    it('should return the nth item', () => {
      expect(nth(15, iterator)).to.eql(115);
    });
    
    it('should work with arrays', () => {
      expect(nth(15, arr)).to.eql(115);
    });
    
    it('should be curried', () => {
      expect(nth(15)(iterator)).to.eql(115);
    });
    
  });
  
  describe('range', () => {
    
    let iterator;
    beforeEach(() => {
      arr = R.range(0, 10);
      iterator = fromArray(arr);
      expected = arr;
    });
    
    it('should create an iterator of numbers with inclusive start and exclusive end', () => {
      expect(toArray(iterator))
        .to.eql(expected);
    });
    
    it('should work with infinite sequences', () => {
      const len = 100;
      const infinite = range(0, Infinity);
      const first = take(len, infinite);
      expect(toArray(first)).to.eql(R.range(0, len));
    });
    
    it('should be curried', () => {
      expect(toArray(range(0)(10))).to.eql(expected);
    });
    
  });
  
  describe('reduce', () => {
    
    beforeEach(() => {
      pred = (acc, num) => acc + num;
      arr = R.range(0, 200);
      iterator = fromArray(arr);
      expected = 19900;
    });
    
    it('should reduce iterator into accumulator', async () => {
      expect(reduce(pred, 0, iterator))
        .to.eql(expected);
    });
    
    it('should work with arrays', async () => {
      expect(reduce(pred, 0, arr))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(reduce(pred)(0)(iterator))
        .to.eql(expected);
    });
            
  });
  
  describe('slice', () => {
    
    let start, end;
    beforeEach(() => {
      start = 10;
      end = 20;
      arr = R.range(0, 100);
      iterator = fromArray(arr);
      expected = R.slice(start, end, arr);
    });
    
    it('should slice between indexes', () => {
      const sliced = slice(start, end, iterator);
      expect(toArray(sliced)).to.eql(expected);
    });
    
    it('should work with arrays', () => {
      const sliced = slice(start, end, arr);
      expect(toArray(sliced)).to.eql(expected);
    });
    
    it('should be curried', () => {
      const sliced = slice(start)(end)(iterator);
      expect(toArray(sliced)).to.eql(expected);
    });
    
  });
  
  describe('sum', () => {
    
    it('should sum the iterator', () => {
      expect(sum(iterator)).to.eql(10);
    });
    
    it('should with with arrays', () => {
      expect(sum(arr)).to.eql(10);
    });
    
  });
  
  describe('take', () => {
    
    beforeEach(() => {
      arr = R.range(50, 500);
      iterator = fromArray(arr);
      expected = R.range(50, 120);
    });
    
    it('should yield the first n items', () => {
      expect(toArray(take(70, iterator)))
        .to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(toArray(take(70, arr)))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(take(70)(iterator)))
        .to.eql(expected);
    });
    
  });
  
  describe('times', () => {
    
    beforeEach(() => {
      expected = R.times(R.always('test'), 10);
    });
    
    it('should yield the item n times', () => {
      expect(toArray(times(10, 'test')))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(times(10)('test')))
        .to.eql(expected);
    });
    
  });
  
  describe('unique', () => {
    
    beforeEach(() => {
      arr = [1, 2, 3, 3, 3, 2, 1];
      iterator = fromArray(arr);
      expected = [1, 2, 3];
    });
    
    it('should yield unique items', () => {
      expect(toArray(unique(iterator)))
        .to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(toArray(unique(arr)))
        .to.eql(expected);
    });
    
  });
  
  describe('zip', () => {
    
    let range1, range2;
    let iter1, iter2;
    beforeEach('stub', () => {
      range1 = R.range(0, 10);
      range2 = R.range(0, 7).reverse();
      iter1 = fromArray(range1);
      iter2 = fromArray(range2);
      expected = R.zip(range1, range2);
    });
        
    it('should yield pairs until the shortest iterator is exhausted', () => {
      expect(toArray(zip(iter1, iter2)))
        .to.eql(expected);
    });
    
    // fixme
    xit('should work with arrays', () => {
      expect(toArray(zip(range1, range2)))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(zip(iter1)(iter2)))
        .to.eql(expected);
    });
    
  });
  
});
