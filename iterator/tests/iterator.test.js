'use strict';

// modules
// const sinon = require('sinon');
const R = require('ramda');
const { expect } = require('chai');

// local
const {
  // repeatSync,
  accumulateSync,
  concatSync,
  cycleSync,
  dropSync,
  enumerateSync,
  filterSync,
  flatMapSync,
  fromArraySync,
  lengthSync,
  nextSync,
  nthSync,
  rangeSync,
  reduceSync,
  sliceSync,
  sumSync,
  takeSync,
  timesSync,
  toArraySync,
  uniqueSync,
  windowSync,
  zipSync,
} = require('..');

describe('iterator', () => {
  
  let pred, iterator, output;
  beforeEach('stub', () => {
    pred = R.identity;
    iterator = rangeSync(0, 5);
    output = [0, 1, 0, 2, 1, 0, 3, 2, 1, 0];
  });
  
  describe('accumulateSync', () => {
    
    it('should work', () => {
      pred = R.add;
      iterator = [1, 2, 3, 4, 5, 6];
      expect([...accumulateSync(pred, iterator)])
        .to.eql([1, 3, 6, 10, 15, 21]);
    });
    
  });
  
  describe('enumerateSync', () => {
    
    it('should yield [item, index] tuples', () => {
      iterator = rangeSync(10, 20);
      const expected = toArraySync(zipSync(
        rangeSync(10, 20),
        rangeSync(0, 10),
      ));
      expect(toArraySync(enumerateSync(iterator)))
        .to.eql(expected);
    });
    
  });
  
  describe('concatSync', () => {
    
    let iterators;
    beforeEach(() => {
      iterators = [
        rangeSync(0, 10),
        rangeSync(10, 20),
      ];
    });
    
    it('should concat iterators', () => {
      expect(toArraySync(concatSync(...iterators)))
        .to.eql(R.range(0, 20));
    });
    
    it('should be curried', () => {
      const iterator = concatSync(iterators[0])(iterators[1]);
      expect(toArraySync(iterator))
        .to.eql(R.range(0, 20));
    });
    
  });
  
  describe('cycleSync', () => {
    
    it('should infinitely cycle through the iterable', () => {
      const iterable = rangeSync(0, 5);
      const cycled = cycleSync(iterable);
      const taken = takeSync(17, cycled);
      expect(toArraySync(taken)).to.eql([
        ...R.range(0, 5),
        ...R.range(0, 5),
        ...R.range(0, 5),
        ...R.range(0, 2),
      ]);
      
    });
    
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
    
    it('should work with arrays', () => {
      pred = (num) => [num, num + 1];
      expect(toArraySync(flatMapSync(pred, iterator)))
        .to.eql([0, 1, 1, 2, 2, 3, 3, 4, 4, 5]);
    });
    
    it('should be curried', () => {
      expect(toArraySync(flatMapSync(pred)(iterator)))
        .to.eql(output);
    });
            
  });
  
  describe('lengthSync', () => {
    
    it('should return the iterable length', () => {
      expect(lengthSync(iterator)).to.eql(5);
    });
    
    it('should exhaust the iterator', () => {
      lengthSync(iterator);
      expect(toArraySync(iterator)).to.eql([]);
    });
    
  });
  
  describe('nthSync', () => {
    
    it('should return the nth item', () => {
      const iterable = rangeSync(100, Infinity);
      expect(nthSync(15, iterable)).to.eql(115);
    });
    
    it('should be curried', () => {
      const iterable = rangeSync(100, Infinity);
      expect(nthSync(15)(iterable)).to.eql(115);
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
    
    it('should advance the iterator', () => {
      nextSync(iterator);
      expect(toArraySync(iterator)).to.eql([1, 2, 3, 4]);
    });
    
  });
  
  describe('rangeSync', () => {
    
    it('should create an iterable of numbers with inclusive start and exclusive end', () => {
      expect(toArraySync(rangeSync(0, 10)))
        .to.eql(R.range(0, 10));
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
  
  describe('sliceSync', () => {
    
    let start, end;
    let iterable, range;
    beforeEach('', () => {
      start = 10;
      end = 20;
      iterable = rangeSync(0, 100);
      range = R.range(0, 100);
    });
    
    it('should slice between indexes', () => {
      const sliced = sliceSync(start, end, iterable);
      const expected = R.slice(start, end, range);
      expect(toArraySync(sliced)).to.eql(expected);
    });
    
    it('should be curried', () => {
      const sliced = sliceSync(start)(end)(iterable);
      const expected = R.slice(start, end, range);
      expect(toArraySync(sliced)).to.eql(expected);
    });
    
  });
  
  describe('sumSync', () => {
    
    it('should sum the iterable', () => {
      expect(sumSync([1, 2, 3])).to.eql(6);
    });
    
  });
  
  describe('takeSync', () => {
    
    let iterable;
    beforeEach(() => {
      iterable = rangeSync(50, 500);
    });
    
    it('should yield the first n items', () => {
      const sub = takeSync(70, iterable);
      expect(toArraySync(sub))
        .to.eql(R.range(50, 120));
    });
    
    it('should be curried', () => {
      const sub = takeSync(70)(iterable);
      expect(toArraySync(sub))
        .to.eql(R.range(50, 120));
    });
    
  });
  
  describe('timesSync', () => {
    
    it('should yield the item n times', () => {
      const expected = R.times(R.always('test'), 10);
      expect(toArraySync(timesSync(10, 'test')))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      const expected = R.times(R.always('test'), 10);
      expect(toArraySync(timesSync(10)('test')))
        .to.eql(expected);
    });
    
  });
  
  describe('zipSync', () => {
    
    let range1, range2;
    let iter1, iter2;
    beforeEach('stub', () => {
      range1 = R.range(0, 10);
      range2 = R.range(0, 7).reverse();
      iter1 = fromArraySync(range1);
      iter2 = fromArraySync(range2);
    });
        
    it('should yield pairs until the shortest iterator is exhausted', () => {
      expect(toArraySync(zipSync(iter1, iter2)))
        .to.eql(R.zip(range1, range2));
    });
    
    it('should be curried', () => {
      expect(toArraySync(zipSync(iter1)(iter2)))
        .to.eql(R.zip(range1, range2));
    });
    
  });
  
  describe('uniqueSync', () => {
    
    let iterable;
    beforeEach('', () => {
      iterable = fromArraySync([1, 2, 3, 3, 3, 2, 1]);
    });
    
    it('should yield unique items', () => {
      expect(toArraySync(uniqueSync(iterable)))
        .to.eql([1, 2, 3]);
    });
    
  });
  
  describe('windowSync', () => {
    
    let iterable, expected;
    beforeEach(() => {
      iterable = windowSync(3, rangeSync(0, 10));
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
    
    it('should yield sliding windows of size n', () => {
      expect(toArraySync(iterable)).to.eql(expected);
    });
    
    it('should be curried', () => {
      iterable = windowSync(3)(rangeSync(0, 10));
      expect(toArraySync(iterable)).to.eql(expected);
    });
    
  });
  
});
