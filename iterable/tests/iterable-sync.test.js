'use strict';

// modules
const R = require('ramda');
const sinon = require('sinon');
const { expect } = require('chai');

const { isGenerator } = require('../../is');

// local
const {
  accumulate,
  concat,
  cycle,
  drop,
  dropWhile,
  enumerate,
  every,
  exhaust,
  filter,
  find,
  flatMap,
  forEach,
  frame,
  from,
  groupWith,
  // includes,
  // indexOf,
  iterateWith,
  length,
  map,
  next,
  nth,
  of,
  range,
  rangeStep,
  reduce,
  repeat,
  // reverse,
  slice,
  some,
  splitEvery,
  StopIteration,
  sum,
  tee,
  take,
  // takeWhile,
  times,
  toArray,
  unique,
  zip,
} = require('../sync');

const noop = () => {};

describe('iterable/sync', () => {
  
  let pred, arr, iterator, expected;
  beforeEach(() => {
    pred = R.identity;
    arr = R.range(0, 5);
    iterator = from(arr);
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
      const arrays = iterators.map(toArray);
      expect(toArray(concat(...arrays)))
        .to.eql(expected);
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
    
    beforeEach(() => {
      expected = R.drop(3, arr);
    });
    
    it('should drop n items', () => {
      expect(toArray(drop(3, iterator))).to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(toArray(drop(3, arr))).to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(drop(3)(iterator))).to.eql(expected);
    });
    
  });
  
  // todo: test for predicate flipping pass / fail
  describe('dropWhile', () => {
    
    beforeEach(() => {
      arr = R.range(0, 100);
      iterator = from(arr);
      pred = n => n < 70;
      expected = R.range(70, 100);
    });
    
    it('should drop items while the predicate is satisfied', () => {
      expect(toArray(dropWhile(pred, iterator)))
        .to.eql(expected);
    });
    
    it('work with arrays', () => {
      expect(toArray(dropWhile(pred, arr)))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(dropWhile(pred)(iterator)))
        .to.eql(expected);
    });
    
  });
  
  describe('enumerate', () => {
    
    beforeEach(() => {
      arr = R.range(10, 20);
      iterator = from(arr);
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
  
  describe('every', () => {
    
    let lt20;
    beforeEach(() => {
      lt20 = (num) => num < 20;
      arr = R.range(0, 10);
      iterator = from(arr);
      expected = R.all(lt20, arr);
    });
    
    it('should return true if all items pass the predicate', () => {
      expect(every(lt20, iterator)).to.eql(expected);
    });
    
    it('should return false if any item does not pass the predicate', () => {
      const lt5 = (num) => num < 5;
      expect(every(lt5, iterator)).to.eql(R.all(lt5, arr));
    });
    
    it('should return true for empty iterators');
    
    it('should be curried', () => {
      expect(every(lt20)(iterator)).to.eql(expected);
    });
    
  });
  
  describe('exhaust', () => {
    
    it('should return undefined', () => {
      expect(exhaust(iterator)).to.eql(undefined);
    });
    
    it('should not exhaust arrays', () => {
      const items = [...arr];
      exhaust(arr);
      expect(arr).to.eql(items);
    });
    
    it('should exhaust the iterator', () => {
      exhaust(iterator);
      expect(toArray(iterator)).to.eql([]);
    });
    
  });
  
  describe('filter', () => {
    
    beforeEach(() => {
      pred = num => num < 8;
      arr = R.range(0, 20);
      iterator = from(arr);
      expected = [0, 1, 2, 3, 4, 5, 6, 7];
    });
    
    it('should yield items that pass the predicate', async () => {
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
  
  describe('find', () => {
    
    let toFind;
    beforeEach(() => {
      arr = R.range(0, 1000);
      iterator = from(arr);
      toFind = 50;
      pred = n => (n === toFind);
      expected = R.find(pred, arr);
    });
    
    it('should return the first item matching predicate', () => {
      expect(find(pred, iterator)).to.eql(expected);
    });
    
    it('should stop iteration at the first predicate match', () => {
      const spy = sinon.spy(pred);
      find(spy, iterator);
      expect(spy.callCount).to.eql(toFind + 1);
    });
    
    it('should be curried', () => {
      expect(find(pred)(iterator)).to.eql(expected);
    });
    
  });
      
  describe('flatMap', () => {
    
    beforeEach(() => {
      pred = function* pred(num) {
        while (num--) yield num;
      };
      arr = R.range(0, 5);
      iterator = from(arr);
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
  
  describe('forEach', () => {
    
    it('should call predicate for each yielded item', () => {
      pred = sinon.stub();
      toArray(forEach(pred, iterator));
      const args = pred.args.map(R.head);
      expect(args).to.eql(arr);
    });
    
    it('should yield items from the input iterator', () => {
      expect(toArray(forEach(noop, iterator))).to.eql(arr);
    });
    
    it('should be curried', () => {
      pred = sinon.stub();
      toArray(forEach(pred)(iterator));
      const args = pred.args.map(R.head);
      expect(args).to.eql(arr);
    });
    
  });
  
  describe('frame', () => {
    
    let num;
    beforeEach(() => {
      arr = R.range(0, 100);
      iterator = from(arr);
      num = 3;
      expected = R.aperture(num, arr);
    });
    
    it('should yield sliding frames of size n', () => {
      expect(toArray(frame(num)(iterator))).to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(toArray(frame(num)(arr))).to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(frame(num)(iterator))).to.eql(expected);
    });
    
  });
  
  describe('from', () => {
    
    it('should return an iterator for an iterable', () => {
      expect(isGenerator(from(arr))).to.eql(true);
      expect(toArray(from(arr))).to.eql(arr);
    });
    
  });
  
  xdescribe('groupWith', () => {
    
    it('should', () => {
      pred = (left, right) => ((left + 1) === right);
      arr = [0, 1, 1, 2, 3, 5, 8, 13, 21];
      iterator = from(arr);
      expect(toArray(groupWith(pred, iterator)))
        .to.eql(R.groupWith(pred, arr));
    });
    
  });
  
  describe('iterateWith', () => {
    
    beforeEach(() => {
      pred = R.add(10);
      expected = [15, 25, 35, 45, 55];
    });
    
    it('should yield initial item and predicate returns', () => {
      iterator = take(5, iterateWith(pred, 15));
      expect(toArray(iterator)).to.eql(expected);
    });
    
    it('should be curried', () => {
      iterator = take(5, iterateWith(pred)(15));
      expect(toArray(iterator)).to.eql(expected);
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
  
  describe('map', () => {
    
    beforeEach(() => {
      pred = R.add(10);
      expected = R.map(pred, arr);
    });
    
    it('should transform yielded items with predicate', () => {
      expect(toArray(map(pred, iterator))).to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(map(pred)(iterator))).to.eql(expected);
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
    
    xit('should return ? for arrays', () => {
      expect(next(arr)).to.eql();
    });
    
    it('should throw StopIteration if the iterator is exhausted', () => {
      exhaust(iterator);
      expect(() => next(iterator)).to.throw(StopIteration);
    });
    
  });
  
  describe('nth', () => {
    
    let index;
    beforeEach(() => {
      index = 25;
      arr = R.range(100, 1000);
      iterator = from(arr);
      expected = R.nth(index, arr);
    });
    
    it('should return the nth item', () => {
      expect(nth(index, iterator)).to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(nth(index, arr)).to.eql(expected);
    });
    
    xit('should work with negative indices', () => {
      expect(nth(-index, iterator))
        .to.eql(R.nth(-index, arr));
    });
    
    it('should be curried', () => {
      expect(nth(index)(iterator)).to.eql(expected);
    });
    
  });
  
  describe('of', () => {
    
    it('should yield arguments', () => {
      const items = R.range(0, 10);
      expect(isGenerator(of(...items))).to.eql(true);
      expect(toArray(of(...items))).to.eql(items);
    });
    
  });
  
  describe('range', () => {
    
    let iterator;
    beforeEach(() => {
      arr = R.range(0, 10);
      iterator = from(arr);
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
  
  describe('rangeStep', () => {
    
    describe('positive step', () => {

      it('should have an inclusive start and exlusive end', () => {
        expect(toArray(rangeStep(1.25, 15, 30)))
          .to.eql([15, 16.25, 17.5, 18.75, 20, 21.25, 22.5, 23.75, 25, 26.25, 27.5, 28.75]);
      });
      
      it('should yield no elements if start > end', () => {
        expect(toArray(rangeStep(1.25, 30, 15)))
          .to.eql([]);
      });
      
    });
    
    describe('negative step', () => {
      
      it('should have an inclusive start and exlusive end', () => {
        expect(toArray(rangeStep(-1.75, 40, 20)))
          .to.eql([40, 38.25, 36.5, 34.75, 33, 31.25, 29.5, 27.75, 26, 24.25, 22.5, 20.75]);
      });
      
      it('should yield no elements if start < end', () => {
        expect(toArray(rangeStep(-1.75, 20, 40)))
          .to.eql([]);
      });
      
    });
    
    it('should be curried', () => {
      expect(toArray(rangeStep(5)(15)(30)))
        .to.eql([15, 20, 25]);
    });
    
  });
  
  describe('reduce', () => {
    
    beforeEach(() => {
      pred = (acc, num) => acc + num;
      arr = R.range(0, 200);
      iterator = from(arr);
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
  
  describe('repeat', () => {
    
    it('should repeat the input infinitely', () => {
      const thing = { test: true };
      const times = 45;
      const taken = toArray(take(times, repeat(thing)));
      expect(taken).to.eql(R.times(() => thing, times));
    });
    
  });
  
  describe('slice', () => {
    
    let start, end;
    beforeEach(() => {
      start = 10;
      end = 20;
      arr = R.range(0, 100);
      iterator = from(arr);
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
  
  describe('some', () => {
    
    beforeEach(() => {
      arr = R.range(0, 10);
      pred = n => n > 5;
      iterator = from(arr);
      expected = R.any(pred, arr);
    });
    
    it('should return true if ay item passes the predicate', () => {
      expect(some(pred, iterator)).to.eql(expected);
    });
    
    it('should return false if any item does not pass the predicate', () => {
      pred = n => n > 100;
      expect(some(pred, iterator)).to.eql(R.any(pred, arr));
    });
    
    it('should return false for empty iterators', () => {
      expect(some(pred, [])).to.eql(false);
    });
    
    it('should be curried', () => {
      expect(some(pred)(iterator)).to.eql(expected);
    });
    
  });
  
  describe('splitEvery', () => {
    
    let n;
    beforeEach(() => {
      n = 3;
      arr = R.range(0, 20);
      iterator = from(arr);
    });
    
    it('should split iterator every n yields', () => {
      expect(toArray(splitEvery(n, iterator)))
        .to.eql(R.splitEvery(n, arr));
    });
    
    it('should be curried', () => {
      expect(toArray(splitEvery(n)(iterator)))
        .to.eql(R.splitEvery(n, arr));
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
      iterator = from(arr);
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
  
  describe('tee', () => {
    
    let n, copies;
    beforeEach(() => {
      n = 5;
      copies = tee(n, iterator);
      expected = [...Array(n)].map(() => arr);
    });
    
    it('should return n copies', () => {
      expect(copies.length).to.eql(n);
      copies.forEach((copy) => {
        expect(isGenerator(copy)).to.eql(true);
        expect(toArray(copy)).to.eql(arr);
      });
    });
    
    it('should exhaust the input iterator when one copy is exhausted', () => {
      tee(5, iterator);
      expect(toArray(iterator)).to.eql(arr);
      
      iterator = from(arr);
      const [copy] = tee(5, iterator);
      toArray(copy);
      expect(toArray(iterator)).to.eql([]);
    });
    
    it('should be curried', () => {
      expect(tee(n)(iterator).map(toArray)).to.eql(expected);
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
      iterator = from(arr);
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
      iter1 = from(range1);
      iter2 = from(range2);
      expected = R.zip(range1, range2);
    });
        
    it('should yield pairs until the shortest iterator is exhausted', () => {
      expect(toArray(zip(iter1, iter2)))
        .to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(toArray(zip(range1, range2)))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(zip(iter1)(iter2)))
        .to.eql(expected);
    });
    
  });
  
});
