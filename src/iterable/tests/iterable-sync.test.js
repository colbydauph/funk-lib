'use strict';

// modules
import * as R from 'ramda';
import sinon from 'sinon';
import { expect } from 'chai';

// local
import { on } from '../../function';
import { random } from '../../number';
import { sample } from '../../array';
import { is, isIterator } from '../../is';
import StopIteration from '../stop-iteration';

// local
const {
  accumulate,
  append,
  concat,
  // corresponds,
  correspondsWith,
  count,
  cycle,
  cycleN,
  drop,
  dropLast,
  dropWhile,
  enumerate,
  every,
  exhaust,
  filter,
  find,
  // findIndex,
  flatMap,
  flatten,
  flattenN,
  forEach,
  frame,
  from,
  // group,
  groupWith,
  includes,
  indexOf,
  indices,
  init,
  intersperse,
  isEmpty,
  iterate,
  join,
  joinWith,
  // last,
  length,
  map,
  // max,
  maxBy,
  // min,
  minBy,
  next,
  // nextOr,
  none,
  nth,
  of,
  pad,
  padTo,
  partition,
  prepend,
  range,
  rangeStep,
  reduce,
  reject,
  repeat,
  reverse,
  scan,
  slice,
  some,
  // sort,
  splitAt,
  splitEvery,
  // sumBy,
  sum,
  // tail,
  take,
  takeWhile,
  tee,
  times,
  toArray,
  unfold,
  unique,
  uniqueWith,
  unnest,
  unzip,
  unzipN,
  zip,
  // zipAll,
  zipAllWith,
  // zipWithN,
  zipWith,
} = require('../sync');

const noop = () => {};

// eslint-disable-next-line max-statements
describe('iterable/sync', () => {
  
  let pred, arr, iterator, expected;
  beforeEach(() => {
    arr = R.range(random(0, 50), random(55, 150));
    iterator = from(arr);
  });
  
  describe('accumulate', () => {
    
    beforeEach(() => {
      pred = R.add;
      expected = R.mapAccum((acc, right) => {
        acc = pred(acc, right);
        return [acc, acc];
      }, 0, arr)[1];
    });
    
    it('should yield accumulated items', () => {
      expect(toArray(accumulate(pred, iterator)))
        .to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(toArray(accumulate(pred)(arr)))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(accumulate(pred)(iterator)))
        .to.eql(expected);
    });
    
  });
  
  describe('append', () => {
    
    it('should append an element', () => {
      expect(toArray(append('test', iterator)))
        .to.eql(R.append('test', arr));
    });
    
    it('should be curried', () => {
      expect(toArray(append('test')(iterator)))
        .to.eql(R.append('test', arr));
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
  
  describe('correspondWith', () => {
    
    let arr1, arr2;
    let iter1, iter2;
    beforeEach(() => {
      arr1 = [
        { id: 123, saved: true },
        { id: 456, saved: false },
        { id: 789, saved: true },
      ];
      arr2 = [
        { id: 123, saved: false },
        { id: 456, saved: true },
        { id: 789, saved: false },
      ];
      iter1 = from(arr1);
      iter2 = from(arr2);
      pred = on(is, R.prop('id'));
    });
    
    it('should return true if elements in same index pass pred', () => {
      expect(correspondsWith(pred, iter1, iter2))
        .to.eql(true);
    });
    
    it('should work with arrays', () => {
      expect(correspondsWith(pred, arr1, arr2))
        .to.eql(true);
    });
    
    it('should return false if elements in same index do not pass pred', () => {
      arr1[0].id = 999;
      expect(correspondsWith(pred, iter1, iter2))
        .to.eql(false);
    });
    
    it('should return false if iterables are different lengths', () => {
      arr1.pop();
      expect(correspondsWith(pred, iter1, iter2))
        .to.eql(false);
    });
    
    it('should be curried', () => {
      expect(correspondsWith(pred)(iter1)(iter2))
        .to.eql(true);
    });
    
  });
  
  describe('count', () => {
    
    beforeEach(() => {
      pred = n => !!(n % 3);
    });
    
    it('should count number of items for which pred returns true', () => {
      expect(count(pred, iterator))
        .to.eql(R.filter(pred, arr).length);
    });
    
    it('should be curried', () => {
      expect(count(pred)(iterator))
        .to.eql(R.filter(pred, arr).length);
    });
    
  });
  
  describe('cycle', () => {
    
    let n;
    beforeEach(() => {
      n = random(10, 200);
      expected = R.pipe(
        n => Math.ceil(n / arr.length),
        R.times(() => arr),
        R.flatten,
        R.take(n),
      )(n);
    });
    
    it('should infinitely cycle through the iterator', () => {
      iterator = R.pipe(cycle, take(n))(iterator);
      expect(toArray(iterator)).to.eql(expected);
    });
    
    it('should work with arrays', () => {
      iterator = R.pipe(cycle, take(n))(arr);
      expect(toArray(iterator)).to.eql(expected);
    });
    
  });
  
  describe('cycleN', () => {
    
    let n;
    beforeEach(() => {
      n = 3;
      expected = R.chain(() => arr, [...Array(n)]);
    });
    
    it('should cycle through the iterator n times', () => {
      iterator = cycleN(n, iterator);
      expect(toArray(iterator)).to.eql(expected);
    });
    
    it('should yield original items if n = 1', () => {
      iterator = cycleN(1, iterator);
      expect(toArray(iterator)).to.eql(arr);
    });
    
    it('should return an empty iterator if n = 0', () => {
      iterator = cycleN(0, iterator);
      expect(toArray(iterator)).to.eql([]);
    });
    
    it('should work with arrays', () => {
      iterator = cycleN(n, arr);
      expect(toArray(iterator)).to.eql(expected);
    });
    
    it('should be curried', () => {
      iterator = cycleN(n)(iterator);
      expect(toArray(iterator)).to.eql(expected);
    });
    
  });
  
  describe('drop', () => {
    
    let n;
    beforeEach(() => {
      n = random(0, 70);
      expected = R.drop(n, arr);
    });
    
    it('should drop n items', () => {
      expect(toArray(drop(n, iterator))).to.eql(expected);
    });
    
    it('should yield all items if n <= 0', () => {
      expect(toArray(drop(-1, iterator))).to.eql(arr);
    });
    
    it('should work with arrays', () => {
      expect(toArray(drop(n, arr))).to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(drop(n)(iterator))).to.eql(expected);
    });
    
  });
  
  describe('dropLast', () => {
  
    it('should drop the last n items', () => {
      const n = random(0, arr.length);
      expect(toArray(dropLast(n, iterator))).to.eql(
        R.dropLast(n, arr),
      );
    });
    
    it('should be curried', () => {
      const n = random(0, arr.length);
      expect(toArray(dropLast(n)(iterator))).to.eql(
        R.dropLast(n, arr),
      );
    });
  
  });
  
  describe('dropWhile', () => {
    
    beforeEach(() => {
      pred = n => (n < 70 || n > 90);
      expected = R.dropWhile(pred, arr);
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
      expected = toArray(zip(
        range(0, arr.length),
        from(arr),
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
    
    beforeEach(() => {
      pred = (num) => num < 20;
      expected = R.all(pred, arr);
    });
    
    it('should return true if all items pass the predicate', () => {
      expect(every(pred, iterator)).to.eql(expected);
    });
    
    it('should return false if any item does not pass the predicate', () => {
      expect(every(R.F, iterator)).to.eql(R.all(R.F, arr));
    });
    
    it('should return true for empty iterators', () => {
      expect(every(pred, of())).to.eql(true);
    });
    
    it('should be curried', () => {
      expect(every(pred)(iterator)).to.eql(expected);
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
      pred = num => num % 2;
      expected = R.filter(pred, arr);
    });
    
    it('should yield items that pass the predicate', () => {
      expect(toArray(filter(pred, iterator)))
        .to.eql(expected);
    });
    
    it('should work with arrays', () => {
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
      toFind = sample(arr);
      pred = n => (n === toFind);
      expected = R.find(pred, arr);
    });
    
    it('should return the first item matching predicate', () => {
      expect(find(pred, iterator)).to.eql(expected);
    });
    
    it('should stop iteration at the first predicate match', () => {
      const spy = sinon.spy(pred);
      find(spy, iterator);
      expect(spy.callCount).to.eql(R.indexOf(toFind, arr) + 1);
    });
    
    it('should be curried', () => {
      expect(find(pred)(iterator)).to.eql(expected);
    });
    
  });
  
  describe('flatten', () => {
    
    it('should flatten recursively', () => {
      arr = [1, [2, 3, [4, 5, 6], [7, 8, 9, [12, 13, 14]]], [9, 10, 11]];
      iterator = from(arr);
      expect(toArray(flatten(iterator)))
        .to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 9, 10, 11]);
    });
    
  });
  
  describe('flattenN', () => {
    
    const input = [1, [2, 3, [4, 5, 6], [7, 8, 9, [12, 13, 14]]], [9, 10, 11]];
    const outputs = {
      0: [1, [2, 3, [4, 5, 6], [7, 8, 9, [12, 13, 14]]], [9, 10, 11]],
      1: [1, 2, 3, [4, 5, 6], [7, 8, 9, [12, 13, 14]], 9, 10, 11],
      2: [1, 2, 3, 4, 5, 6, 7, 8, 9, [12, 13, 14], 9, 10, 11],
      3: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 9, 10, 11],
      4: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 9, 10, 11],
    };
    
    it('should flatten n levels of depth', () => {
      Object.entries(outputs).forEach(([n, output]) => {
        iterator = from(input);
        expect(toArray(flattenN(+n, iterator))).to.eql(output);
      });
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
    
    it('should yield all yielded items from predicate', () => {
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
      num = random(1, arr.length - 1);
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
      expect(isIterator(from(arr))).to.eql(true);
      expect(toArray(from(arr))).to.eql(arr);
    });
    
  });
  
  describe('groupWith', () => {
    
    it('should', () => {
      const preds = [
        (left, right) => (left === right),
        (left, right) => (left !== right),
        (left, right) => (left >= right),
        (left, right) => (left <= right),
        (left, right) => (left + 1 === right),
        (left, right) => (left % 2 === right % 2),
      ];
      [
        [0, 1, 1, 2, 2, 3, 4, 5, 5],
        [],
        [0, 0, 0, 0],
        [9, 8, 7, 6, 5, 4, 3, 2, 1],
        [2, 2, 1, 2, 3, 4, 4, 6, 8, 7, 1, 2, 9, 9],
      ].forEach((arr) => {
        
        preds.forEach((pred) => {
          expect(toArray(groupWith(pred, from(arr))))
            .to.eql(R.groupWith(pred, arr));
        });
        
      });
      
    });
    
  });
  
  describe('includes', () => {
    
    let item;
    beforeEach(() => {
      item = sample(arr);
    });
    
    it('should return true if a value in the iterable strictly equals', () => {
      expect(includes(item, iterator)).to.eql(true);
    });
    
    it('should return false if no value in the iterable strictly equals', () => {
      expect(includes({ test: true }, iterator)).to.eql(false);
    });
    
  });
  
  describe('indexOf', () => {
    
    let item;
    beforeEach(() => {
      item = sample(arr);
    });
    
    it('should return the index of the first strictly equal match', () => {
      expect(indexOf(item, iterator))
        .to.eql(R.indexOf(item, arr));
    });
    
    it('should return -1 if no value in the iterable strictly equals', () => {
      expect(indexOf({ test: true }, iterator)).to.eql(-1);
    });
    
  });
  
  describe('indices', () => {
    
    it('should return iterator of indices', () => {
      expect(toArray(indices(iterator)))
        .to.eql(R.keys(arr).map(n => +n));
    });
    
  });
  
  describe('init', () => {
    
    it('should yield every item, but the last', () => {
      expect(toArray(init(iterator))).to.eql(
        R.init(arr)
      );
    });
    
  });
  
  describe('intersperse', () => {
    
    let sep;
    beforeEach(() => {
      sep = '|';
    });
    
    it('should yield seperator between items', () => {
      expect(toArray(intersperse(sep, iterator)))
        .to.eql(R.intersperse(sep, arr));
    });
    
    it('should be curried', () => {
      expect(toArray(intersperse(sep)(iterator)))
        .to.eql(R.intersperse(sep, arr));
    });
    
  });
  
  describe('isEmpty', () => {
    
    it('should return true for empty iterator', () => {
      expect(isEmpty(of())).to.eql(true);
    });
    
    it('should return false for iterators with > 0 items', () => {
      expect(isEmpty(of(1))).to.eql(false);
    });
    
  });
  
  describe('iterate', () => {
    
    let init;
    beforeEach(() => {
      init = 15;
      pred = R.add(10);
      expected = [15, 25, 35, 45, 55];
    });
    
    it('should yield initial item and predicate returns', () => {
      iterator = take(5, iterate(pred, init));
      expect(toArray(iterator)).to.eql(expected);
    });
    
    it('should be curried', () => {
      iterator = take(5, iterate(pred)(init));
      expect(toArray(iterator)).to.eql(expected);
    });
    
  });

  describe('join', () => {
    
    it('should join iterator into string', () => {
      expect(join(iterator))
        .to.eql(R.join('', arr));
    });
    
  });

  describe('joinWith', () => {
    
    let sep;
    beforeEach(() => {
      sep = '|';
    });
    
    it('should join iterator into string with interspersed separator', () => {
      expect(joinWith(sep, iterator))
        .to.eql(R.join(sep, arr));
    });
    
    it('should be curried', () => {
      expect(joinWith(sep)(iterator))
        .to.eql(R.join(sep, arr));
    });
    
  });

  describe('length', () => {
    
    it('should return the iterator length', () => {
      expect(length(iterator)).to.eql(arr.length);
    });
    
    it('should work with arrays', () => {
      expect(length(arr)).to.eql(arr.length);
    });
    
    it('should exhaust the iterator', () => {
      length(iterator);
      expect(toArray(iterator)).to.eql([]);
    });
    
  });
  
  describe('map', () => {
    
    beforeEach(() => {
      pred = R.add(random(10, 20));
      expected = R.map(pred, arr);
    });
    
    it('should transform yielded items with predicate', () => {
      expect(toArray(map(pred, iterator))).to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(map(pred)(iterator))).to.eql(expected);
    });
    
  });
  
  describe('maxBy', () => {
    
    let objs;
    beforeEach(() => {
      objs = arr.map(id => ({ id }));
      iterator = from(objs);
      pred = R.prop('id');
      expected = R.reduce(Math.max, -Infinity, arr);
    });
    
    it('should return max item after pred', () => {
      expect(maxBy(pred, iterator)).to.eql(expected);
    });
    
    it('should work on arrays', () => {
      expect(maxBy(pred, objs)).to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(maxBy(pred)(iterator)).to.eql(expected);
    });
    
  });
  
  describe('minBy', () => {
    
    let objs;
    beforeEach(() => {
      objs = arr.map(id => ({ id }));
      iterator = from(objs);
      pred = R.prop('id');
      expected = R.reduce(Math.min, Infinity, arr);
    });
    
    it('should return max item after pred', () => {
      expect(minBy(pred, iterator)).to.eql(expected);
    });
    
    it('should work on arrays', () => {
      expect(minBy(pred, objs)).to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(minBy(pred)(iterator)).to.eql(expected);
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
      expect(yields).to.eql([
        arr[0],
        arr[1],
        arr[2],
        arr[3],
      ]);
    });
    
    it('should return the next value in the iterator', () => {
      expect(next(iterator)).to.eql(R.head(arr));
    });
    
    it('should advance the iterator', () => {
      next(iterator);
      expect(toArray(iterator)).to.eql(arr.slice(1));
    });
    
    xit('should return ? for arrays', () => {
      expect(next(arr)).to.eql();
    });
    
    it('should throw StopIteration if the iterator is exhausted', () => {
      exhaust(iterator);
      expect(() => next(iterator)).to.throw(StopIteration);
    });
    
  });
  
  describe('none', () => {
    
    beforeEach(() => {
      pred = n => n < Infinity;
    });
    
    it('should return false if any item passes the predicate', () => {
      expect(none(pred, iterator)).to.eql(false);
    });
    
    it('should return true if no items pass the predicate', () => {
      pred = n => n > Infinity;
      expect(none(pred, iterator)).to.eql(true);
    });
    
    it('should return true for empty iterators', () => {
      expect(none(pred, of())).to.eql(true);
    });
    
    it('should be curried', () => {
      expect(none(pred)(iterator)).to.eql(false);
    });
    
  });
  
  describe('nth', () => {
    
    let index;
    beforeEach(() => {
      index = random(0, arr.length - 1);
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
      expect(isIterator(of(...arr))).to.eql(true);
      expect(toArray(of(...arr))).to.eql(arr);
    });
    
  });
  
  describe('pad', () => {
    
    let padItem, n;
    beforeEach(() => {
      padItem = 'world';
      n = 100;
      arr = ['hello', 'this', 'is', 'my'];
      iterator = pad(padItem, from(arr));
      expected = [
        ...arr,
        ...R.times(R.always(padItem), n - arr.length),
      ];
    });
  
    it('should pad to infinity', () => {
      expect(toArray(take(n, iterator))).to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(take(n)(iterator))).to.eql(expected);
    });
  
  });
  
  describe('padTo', () => {
    
    let padItem, n;
    beforeEach(() => {
      padItem = 'world';
      n = random(10, 500);
      arr = ['hello', 'this', 'is', 'my'];
      iterator = padTo(n, padItem, from(arr));
      expected = [
        ...arr,
        ...R.times(R.always(padItem), n - arr.length),
      ];
    });
    
    it('should return iterator of length n', () => {
      expect(length(iterator)).to.eql(n);
    });
  
    it('should pad to length of n', () => {
      expect(toArray(iterator)).to.eql(expected);
    });
    
    it('should not truncate when n < iterable length', () => {
      iterator = padTo(2, padItem, from(arr));
      expect(toArray(iterator)).to.eql(arr);
    });
    
    it('should be curried', () => {
      expect(toArray(padTo(n)(padItem)(from(arr)))).to.eql(expected);
    });
  
  });
  

  
  describe('partition', () => {
    
    beforeEach(() => {
      pred = n => n % 2;
    });
    
    it('should bifurcate by pred', () => {
      expect(partition(pred, iterator).map(toArray))
        .to.eql(R.partition(pred, arr));
    });
    
    it('should be curried', () => {
      expect(partition(pred)(iterator).map(toArray))
        .to.eql(R.partition(pred, arr));
    });
    
  });
  
  describe('prepend', () => {
    
    let item;
    beforeEach(() => {
      item = 'test';
      expected = R.prepend(item, arr);
    });
    
    it('should prepend an element', () => {
      expect(toArray(prepend(item, iterator)))
        .to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(toArray(prepend(item, arr)))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(prepend(item)(iterator)))
        .to.eql(expected);
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
    
    it('should return an empty iterable when step = 0', () => {
      // asc
      expect(toArray(rangeStep(0, 20, 40))).to.eql([]);
      // desc
      expect(toArray(rangeStep(0, 80, 40))).to.eql([]);
    });
    
    it('should be curried', () => {
      expect(toArray(rangeStep(5)(15)(30)))
        .to.eql([15, 20, 25]);
    });
    
  });
  
  describe('reduce', () => {
    
    beforeEach(() => {
      pred = R.add;
      expected = R.reduce(pred, 0, arr);
    });
    
    it('should reduce iterator into accumulator', () => {
      expect(reduce(pred, 0, iterator))
        .to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(reduce(pred, 0, arr))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(reduce(pred)(0)(iterator))
        .to.eql(expected);
    });
            
  });
  
  describe('reject', () => {
    
    beforeEach(() => {
      pred = num => num % 2;
      expected = R.reject(pred, arr);
    });
    
    it('should yield items that do not pass the predicate', () => {
      expect(toArray(reject(pred, iterator)))
        .to.eql(expected);
    });
    
  });
  
  describe('repeat', () => {
    
    let n;
    beforeEach(() => {
      n = random(1, 20);
    });
    
    it('should repeat the input infinitely', () => {
      const thing = { test: true };
      const taken = toArray(take(n, repeat(thing)));
      expect(taken).to.eql(R.times(() => thing, n));
    });
    
  });
  
  describe('reverse', () => {
    
    it('should reverse the iterator', () => {
      expect(toArray(reverse(iterator))).to.eql(R.reverse(arr));
    });
    
  });
  
  describe('scan', () => {
    
    beforeEach(() => {
      pred = R.add;
    });
    
    it('should yield intermediate reductions', () => {
      expect(toArray(scan(pred, 1, iterator)))
        .to.eql(R.scan(pred, 1, arr));
    });
    
    it('should be curried', () => {
      expect(toArray(scan(pred)(1)(iterator)))
        .to.eql(R.scan(pred, 1, arr));
    });
    
  });
  
  describe('slice', () => {
    
    let start, end;
    beforeEach(() => {
      const mid = Math.ceil(arr.length / 2);
      start = random(0, mid);
      end = random(mid, arr.length);
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
      pred = n => n > 5;
      expected = R.any(pred, arr);
    });
    
    it('should return true if any item passes the predicate', () => {
      expect(some(pred, iterator)).to.eql(expected);
    });
    
    it('should return false if any item does not pass the predicate', () => {
      pred = n => n > Infinity;
      expect(some(pred, iterator)).to.eql(R.any(pred, arr));
    });
    
    it('should return false for empty iterators', () => {
      expect(some(pred, of())).to.eql(false);
    });
    
    it('should be curried', () => {
      expect(some(pred)(iterator)).to.eql(expected);
    });
    
  });
  
  describe('splitAt', () => {
    
    let n;
    beforeEach(() => {
      n = random(0, arr.length - 1);
    });
    
    it('should split iterator at the nth element', () => {
      const [left, right] = splitAt(n, iterator);
      const [leftArr, rightArr] = R.splitAt(n, arr);
      expect(toArray(left))
        .to.eql(leftArr);
      expect(toArray(right))
        .to.eql(rightArr);
    });
    
  });
  
  describe('splitEvery', () => {
    
    let n;
    beforeEach(() => {
      n = random(1, 10);
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
    
    beforeEach(() => {
      expected = R.reduce(R.add, 0, arr);
    });
    
    it('should sum the iterator', () => {
      expect(sum(iterator)).to.eql(expected);
    });
    
    it('should with with arrays', () => {
      expect(sum(arr)).to.eql(expected);
    });
    
  });
  
  describe('take', () => {
    
    let n;
    beforeEach(() => {
      n = random(0, arr.length - 1);
      expected = R.take(n, arr);
    });
    
    it('should yield the first n items', () => {
      expect(toArray(take(n, iterator)))
        .to.eql(expected);
    });
    
    it('should yield nothing if n <= 0 ', () => {
      expect(toArray(take(-1, iterator)))
        .to.eql([]);
    });
    
    it('should work with arrays', () => {
      expect(toArray(take(n, arr)))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(take(n)(iterator)))
        .to.eql(expected);
    });
    
  });
  
  describe('takeWhile', () => {
    
    beforeEach(() => {
      arr = R.range(50, 500);
      iterator = from(arr);
      pred = n => (n < 175 || n > 200);
      expected = R.takeWhile(pred, arr);
    });
    
    it('should take items while pred is true', () => {
      expect(toArray(takeWhile(pred, iterator)))
        .to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(toArray(takeWhile(pred, arr)))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(takeWhile(pred)(iterator)))
        .to.eql(expected);
    });
    
  });
  
  describe('tee', () => {
    
    let n, copies;
    beforeEach(() => {
      n = random(1, 10);
      copies = tee(n, iterator);
      expected = [...Array(n)].map(() => arr);
    });
    
    it('should return n copies', () => {
      expect(copies.length).to.eql(n);
      copies.forEach((copy) => {
        expect(isIterator(copy)).to.eql(true);
        expect(toArray(copy)).to.eql(arr);
      });
    });
    
    it('should exhaust the input iterator when one copy is exhausted', () => {
      tee(n, iterator);
      expect(toArray(iterator)).to.eql(arr);
      
      iterator = from(arr);
      const [copy] = tee(n, iterator);
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
  
  describe('uniqueWith', () => {
    
    beforeEach(() => {
      arr = [1, 2, 3, 3, 3, 2, 1].map((id) => ({ id }));
      pred = on(is, R.prop('id'));
      iterator = from(arr);
    });
    
    it('should yield unique items', () => {
      expect(toArray(uniqueWith(pred, iterator)))
        .to.eql(R.uniqWith(pred, arr));
    });
    
    it('should work with arrays', () => {
      expect(toArray(uniqueWith(pred, arr)))
        .to.eql(R.uniqWith(pred, arr));
    });
    
    it('should be curried', () => {
      expect(toArray(uniqueWith(pred)(iterator)))
        .to.eql(R.uniqWith(pred, arr));
    });
    
  });
  
  describe('unfold', () => {
    
    beforeEach(() => {
      pred = n => (n > 50 ? false : [-n, n + 10]);
    });
    
    it('should yield until a falsey value is returned', () => {
      expect(toArray(unfold(pred, 10)))
        .to.eql(R.unfold(pred, 10));
    });
    
    it('should be curried', () => {
      expect(toArray(unfold(pred)(10)))
        .to.eql(R.unfold(pred, 10));
    });
    
  });
  
  describe('unnest', () => {
        
    it('should flatten one level', () => {
      arr = [1, [2, 3, [4, 5, 6], [7, 8, 9, [12, 13, 14]]], [9, 10, 11]];
      iterator = from(arr);
      expect(toArray(unnest(iterator)))
        .to.eql(R.unnest(arr));
    });
    
  });
  
  describe('unzip', () => {
    
    let arr1, arr2;
    let range1, range2;
    beforeEach(() => {
      arr1 = R.range(0, 10);
      arr2 = R.range(10, 20);
      range1 = from(arr1);
      range2 = from(arr2);
    });
    
    it('should unzip tuples', () => {
      const zipped = zip(range1, range2);
      const [left, right] = unzip(zipped);
      expect(toArray(left)).to.eql(arr1);
      expect(toArray(right)).to.eql(arr2);
    });
    
  });
  
  describe('unzipN', () => {
    
    let n;
    beforeEach(() => {
      n = random(1, 10);
      arr = [...Array(random(1, 10))]
        .map(() => [...Array(n)]
          .map(() => random(
            random(0, 10),
            random(10, 50),
          )));
      iterator = from(arr);
      expected = [...Array(n)]
        .map((_, i) => arr.map(R.nth(i)));
    });
    
    it('should unzip n-pls', () => {
      const iterators = unzipN(n, iterator);
      iterators.forEach((it) => {
        expect(isIterator(it)).to.eql(true);
      });
      expect(iterators.map(toArray))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(unzipN(n)(iterator).map(toArray))
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
  
  describe('zipAllWith', () => {
    
    let arrays, iterables, len, n;
    beforeEach(() => {
      n = random(1, 10);
      len = random(1, 10);
      pred = R.unapply(R.sum);
      arrays = [...Array(n)].map(() => {
        const num = random(0, 100);
        return R.range(num, num + len);
      });
      iterables = arrays.map(from);
      expected = [...Array(len)]
        .map((_, i) => pred(...arrays.map(nth(i))));
    });
    
    it('should zip iterables', () => {
      expect(toArray(zipAllWith(pred, iterables)))
        .to.eql(expected);
    });
    
    it('should work with arrays', () => {
      expect(toArray(zipAllWith(pred, arrays)))
        .to.eql(expected);
    });
    
    it('should be curried', () => {
      expect(toArray(zipAllWith(pred)(iterables)))
        .to.eql(expected);
    });
    
  });
  
  describe('zipWith', () => {
    
    let range1, range2;
    let iter1, iter2;
    beforeEach('stub', () => {
      pred = R.add;
      range1 = R.range(0, 10);
      range2 = R.range(10, 20);
      iter1 = from(range1);
      iter2 = from(range2);
      expected = R.zip(range1, range2);
    });
    
    it('should yield items returned from predicate', () => {
      expect(toArray(zipWith(pred, iter1, iter2)))
        .to.eql(R.zipWith(pred, range1, range2));
    });
    
  });
  
});
