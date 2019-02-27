// modules
import * as R from 'ramda';
import sinon from 'sinon';
import { expect } from 'chai';

// local
import { on } from '../../function';
import {
  toAsync,
  map as mapP,
  reduce as reduceP,
  // delay,
} from '../../async';
import { random } from '../../number';
import { sample } from '../../array';
import { is, isIterator, isAsyncIterable } from '../../is';
import StopIteration from '../stop-iteration';

// local
import {
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
  flatUnfold,
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
} from '../async';

const noop = () => {};

// eslint-disable-next-line max-statements
describe('iterable/async', () => {
  
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
  
    it('should yield accumulated items', async () => {
      await expect(toArray(accumulate(toAsync(pred), iterator)))
        .to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      await expect(toArray(accumulate(toAsync(pred))(arr)))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(toArray(accumulate(toAsync(pred))(iterator)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('append', () => {
  
    it('should append an element', async () => {
      await expect(toArray(append('test', iterator)))
        .to.eventually.eql(R.append('test', arr));
    });
  
    it('should be curried', async () => {
      await expect(toArray(append('test')(iterator)))
        .to.eventually.eql(R.append('test', arr));
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
  
    it('should concat iterators', async () => {
      await expect(toArray(concat(...iterators)))
        .to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      const arrays = await mapP(toArray, iterators);
      await expect(toArray(concat(...arrays)))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(toArray(concat(iterators[0])(iterators[1])))
        .to.eventually.eql(expected);
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
  
    it('should return true if elements in same index pass pred', async () => {
      await expect(correspondsWith(toAsync(pred), iter1, iter2))
        .to.eventually.eql(true);
    });
  
    it('should work with arrays', async () => {
      await expect(correspondsWith(toAsync(pred), arr1, arr2))
        .to.eventually.eql(true);
    });
  
    it('should return false if elements in same index do not pass pred', async () => {
      arr1[0].id = 999;
      await expect(correspondsWith(toAsync(pred), iter1, iter2))
        .to.eventually.eql(false);
    });
  
    it('should return false if iterables are different lengths', async () => {
      arr1.pop();
      await expect(correspondsWith(toAsync(pred), iter1, iter2))
        .to.eventually.eql(false);
    });
  
    it('should be curried', async () => {
      await expect(correspondsWith(toAsync(pred))(iter1)(iter2))
        .to.eventually.eql(true);
    });
  
  });
  
  describe('count', () => {
  
    beforeEach(() => {
      pred = n => !!(n % 3);
    });
  
    it('should count number of items for which pred returns true', async () => {
      await expect(count(toAsync(pred), iterator))
        .to.eventually.eql(R.filter(pred, arr).length);
    });
  
    it('should be curried', async () => {
      await expect(count(toAsync(pred))(iterator))
        .to.eventually.eql(R.filter(pred, arr).length);
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
  
    it('should infinitely cycle through the iterator', async () => {
      iterator = R.pipe(cycle, take(n))(iterator);
      await expect(toArray(iterator)).to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      iterator = R.pipe(cycle, take(n))(arr);
      await expect(toArray(iterator)).to.eventually.eql(expected);
    });
  
  });
  
  describe('cycleN', () => {
  
    let n;
    beforeEach(() => {
      n = 3;
      expected = R.chain(() => arr, [...Array(n)]);
    });
  
    it('should cycle through the iterator n times', async () => {
      iterator = cycleN(n, iterator);
      await expect(toArray(iterator))
        .to.eventually.eql(expected);
    });
  
    it('should yield original items if n = 1', async () => {
      iterator = cycleN(1, iterator);
      await expect(toArray(iterator))
        .to.eventually.eql(arr);
    });
  
    it('should return an empty iterator if n = 0', async () => {
      iterator = cycleN(0, iterator);
      await expect(toArray(iterator))
        .to.eventually.eql([]);
    });
  
    it('should work with arrays', async () => {
      iterator = cycleN(n, arr);
      await expect(toArray(iterator))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      iterator = cycleN(n)(iterator);
      await expect(toArray(iterator))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('drop', () => {
  
    let n;
    beforeEach(() => {
      n = random(0, 70);
      expected = R.drop(n, arr);
    });
  
    it('should drop n items', async () => {
      await expect(toArray(drop(n, iterator)))
        .to.eventually.eql(expected);
    });
  
    it('should yield all items if n <= 0', async () => {
      await expect(toArray(drop(-1, iterator)))
        .to.eventually.eql(arr);
    });
  
    it('should work with arrays', async () => {
      await expect(toArray(drop(n, arr)))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(toArray(drop(n)(iterator)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('dropLast', () => {
  
    it('should drop the last n items', async () => {
      const n = random(0, arr.length);
      await expect(toArray(dropLast(n, iterator))).to.eventually.eql(
        R.dropLast(n, arr),
      );
    });
  
    it('should be curried', async () => {
      const n = random(0, arr.length);
      await expect(toArray(dropLast(n)(iterator))).to.eventually.eql(
        R.dropLast(n, arr),
      );
    });
  
  });
  
  describe('dropWhile', () => {
  
    beforeEach(() => {
      pred = n => (n < 70 || n > 90);
      expected = R.dropWhile(pred, arr);
    });
  
    it('should drop items while the predicate is satisfied', async () => {
      await expect(toArray(dropWhile(toAsync(pred), iterator)))
        .to.eventually.eql(expected);
    });
  
    it('work with arrays', async () => {
      await expect(toArray(dropWhile(toAsync(pred), arr)))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(toArray(dropWhile(toAsync(pred))(iterator)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('enumerate', () => {
  
    beforeEach(async () => {
      expected = await toArray(zip(
        range(0, arr.length),
        from(arr),
      ));
    });
  
    it('should yield [item, index] tuples', async () => {
      await expect(toArray(enumerate(iterator)))
        .to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      await expect(toArray(enumerate(arr)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('every', () => {
  
    beforeEach(() => {
      pred = (num) => num < 20;
      expected = R.all(pred, arr);
    });
  
    it('should return true if all items pass the predicate', async () => {
      await expect(every(toAsync(pred), iterator))
        .eventually.to.eql(expected);
    });
  
    it('should return false if any item does not pass the predicate', async () => {
      await expect(every(toAsync(R.F), iterator))
        .eventually.to.eql(R.all(R.F, arr));
    });
  
    it('should return true for empty iterators', async () => {
      await expect(every(toAsync(pred), of()))
        .eventually.to.eql(true);
    });
  
    it('should be curried', async () => {
      await expect(every(toAsync(pred))(iterator))
        .eventually.to.eql(expected);
    });
  
  });
  
  describe('exhaust', () => {
  
    it('should return undefined', async () => {
      await expect(exhaust(iterator))
        .to.eventually.eql(undefined);
    });
  
    it('should not exhaust arrays', async () => {
      const items = [...arr];
      await exhaust(arr);
      expect(arr).to.eql(items);
    });
  
    it('should exhaust the iterator', async () => {
      await exhaust(iterator);
      await expect(toArray(iterator))
        .to.eventually.eql([]);
    });
  
  });
  
  describe('filter', () => {
  
    beforeEach(() => {
      pred = num => num % 2;
      expected = R.filter(pred, arr);
    });
  
    it('should yield items that pass the predicate', async () => {
      await expect(toArray(filter(toAsync(pred), iterator)))
        .to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      await expect(toArray(filter(toAsync(pred), arr)))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(toArray(filter(toAsync(pred))(iterator)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('find', () => {
  
    let toFind;
    beforeEach(() => {
      toFind = sample(arr);
      pred = n => (n === toFind);
      expected = R.find(pred, arr);
    });
  
    it('should return the first item matching predicate', async () => {
      await expect(find(toAsync(pred), iterator))
        .to.eventually.eql(expected);
    });
  
    it('should stop iteration at the first predicate match', async () => {
      const spy = sinon.spy(toAsync(pred));
      await find(spy, iterator);
      expect(spy.callCount)
        .to.eql(R.indexOf(toFind, arr) + 1);
    });
  
    it('should be curried', async () => {
      await expect(find(toAsync(pred))(iterator))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('flatten', () => {
  
    it('should flatten recursively', async () => {
      arr = [1, [2, 3, [4, 5, 6], [7, 8, 9, [12, 13, 14]]], [9, 10, 11]];
      iterator = from(arr);
      await expect(toArray(flatten(iterator)))
        .to.eventually.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 9, 10, 11]);
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
  
    it('should flatten n levels of depth', async () => {
      for (const [n, output] of Object.entries(outputs)) {
        iterator = from(input);
        await expect(toArray(flattenN(+n, iterator)))
          .to.eventually.eql(output);
      }
    });
  
  });
  
  describe('flatMap', () => {
  
    beforeEach(() => {
      pred = async function* pred(num) {
        while (num--) yield await num;
      };
      arr = R.range(0, 5);
      iterator = from(arr);
      expected = [0, 1, 0, 2, 1, 0, 3, 2, 1, 0];
    });
  
    it('should yield all yielded items from predicate', async () => {
      expect(await toArray(flatMap(pred, iterator)))
        .to.eql(expected);
    });
  
    it('should work with arrays', async () => {
      pred = async (num) => [num, num + 1];
      expect(await toArray(flatMap(pred, arr)))
        .to.eql([0, 1, 1, 2, 2, 3, 3, 4, 4, 5]);
    });
  
    it('should be curried', async () => {
      expect(await toArray(flatMap(pred)(iterator)))
        .to.eql(expected);
    });
  
  });
  
  describe('flatUnfold', () => {
    
    it('should flatten yielded items', async () => {
      iterator = flatUnfold(async function* flatUnfold(n) {
        if (n >= 5) return null;
        yield* from([n, n * 2]);
        return (n + 1);
      }, 0);
      await expect(toArray(iterator)).to.eventually.eql([
        0, 0, 1, 2, 2, 4, 3, 6, 4, 8,
      ]);
    });
    
  });
  
  describe('forEach', () => {
  
    it('should call predicate for each yielded item', async () => {
      pred = sinon.stub().resolves();
      await toArray(forEach(pred, iterator));
      const args = pred.args.map(R.head);
      expect(args).to.eql(arr);
    });
  
    it('should yield items from the input iterator', async () => {
      await expect(toArray(forEach(noop, iterator)))
        .to.eventually.eql(arr);
    });
  
    it('should be curried', async () => {
      pred = sinon.stub().resolves();
      await toArray(forEach(pred)(iterator));
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
  
    it('should yield sliding frames of size n', async () => {
      await expect(toArray(frame(num)(iterator)))
        .to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      await expect(toArray(frame(num)(arr)))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(toArray(frame(num)(iterator)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('from', () => {
  
    it('should return an async iterator for an iterable', async () => {
      expect(isAsyncIterable(from(arr))).to.eql(true);
      expect(isIterator(from(arr))).to.eql(true);
      expect(await toArray(from(arr))).to.eql(arr);
    });
  
  });
  
  describe('groupWith', () => {
  
    it('should', async () => {
      const preds = [
        (left, right) => (left === right),
        (left, right) => (left !== right),
        (left, right) => (left >= right),
        (left, right) => (left <= right),
        (left, right) => (left + 1 === right),
        (left, right) => (left % 2 === right % 2),
      ];
      
      for (const arr of [
        [0, 1, 1, 2, 2, 3, 4, 5, 5],
        [],
        [0, 0, 0, 0],
        [9, 8, 7, 6, 5, 4, 3, 2, 1],
        [2, 2, 1, 2, 3, 4, 4, 6, 8, 7, 1, 2, 9, 9],
      ]) {
        for (const pred of preds) {
          await expect(toArray(groupWith(toAsync(pred), from(arr))))
            .to.eventually.eql(R.groupWith(pred, arr));
        }
      }
  
    });
  
  });
  
  describe('includes', () => {
  
    let item;
    beforeEach(() => {
      item = sample(arr);
    });
  
    it('should return true if a value in the iterable strictly equals', async () => {
      await expect(includes(item, iterator)).to.eventually.eql(true);
    });
  
    it('should return false if no value in the iterable strictly equals', async () => {
      await expect(includes({ test: true }, iterator)).to.eventually.eql(false);
    });
  
  });
  
  describe('indexOf', () => {
  
    let item;
    beforeEach(() => {
      item = sample(arr);
    });
  
    it('should return the index of the first strictly equal match', async () => {
      await expect(indexOf(item, iterator))
        .to.eventually.eql(R.indexOf(item, arr));
    });
  
    it('should return -1 if no value in the iterable strictly equals', async () => {
      await expect(indexOf({ test: true }, iterator)).to.eventually.eql(-1);
    });
  
  });
  
  describe('indices', () => {
  
    it('should return iterator of indices', async () => {
      await expect(toArray(indices(iterator)))
        .to.eventually.eql(R.keys(arr).map(n => +n));
    });
  
  });
  
  describe('init', () => {
  
    it('should yield every item, but the last', async () => {
      await expect(toArray(init(iterator))).to.eventually.eql(
        R.init(arr)
      );
    });
  
  });
  
  describe('intersperse', () => {
  
    let sep;
    beforeEach(() => {
      sep = '|';
    });
  
    it('should yield seperator between items', async () => {
      await expect(toArray(intersperse(sep, iterator)))
        .to.eventually.eql(R.intersperse(sep, arr));
    });
  
    it('should be curried', async () => {
      await expect(toArray(intersperse(sep)(iterator)))
        .to.eventually.eql(R.intersperse(sep, arr));
    });
  
  });
  
  describe('isEmpty', () => {
  
    it('should return true for empty iterator', async () => {
      await expect(isEmpty(of())).to.eventually.eql(true);
    });
  
    it('should return false for iterators with > 0 items', async () => {
      await expect(isEmpty(of(1))).to.eventually.eql(false);
    });
  
  });
  
  describe('iterate', () => {
  
    let init;
    beforeEach(() => {
      init = 15;
      pred = R.add(10);
      expected = [15, 25, 35, 45, 55];
    });
  
    it('should yield initial item and predicate returns', async () => {
      iterator = take(5, iterate(toAsync(pred), init));
      await expect(toArray(iterator)).to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      iterator = take(5, iterate(toAsync(pred))(init));
      await expect(toArray(iterator)).to.eventually.eql(expected);
    });
  
  });
  
  describe('join', () => {
  
    it('should join iterator into string', async () => {
      await expect(join(iterator))
        .to.eventually.eql(R.join('', arr));
    });
  
  });
  
  describe('joinWith', () => {
  
    let sep;
    beforeEach(() => {
      sep = '|';
    });
  
    it('should join iterator into string with interspersed separator', async () => {
      await expect(joinWith(sep, iterator))
        .to.eventually.eql(R.join(sep, arr));
    });
  
    it('should be curried', async () => {
      await expect(joinWith(sep)(iterator))
        .to.eventually.eql(R.join(sep, arr));
    });
  
  });
  
  describe('length', () => {
  
    it('should return the iterator length', async () => {
      await expect(length(iterator)).to.eventually.eql(arr.length);
    });
  
    it('should work with arrays', async () => {
      await expect(length(arr)).to.eventually.eql(arr.length);
    });
  
    it('should exhaust the iterator', async () => {
      await length(iterator);
      await expect(toArray(iterator)).to.eventually.eql([]);
    });
  
  });
  
  describe('map', () => {
  
    beforeEach(async () => {
      pred = R.add(random(10, 20));
      expected = R.map(pred, arr);
    });
  
    it('should transform yielded items with predicate', async () => {
      expect(await toArray(map(toAsync(pred), iterator))).to.eql(expected);
    });
  
    it('should be curried', async () => {
      expect(await toArray(map(toAsync(pred))(iterator))).to.eql(expected);
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
  
    it('should return max item after pred', async () => {
      await expect(maxBy(toAsync(pred), iterator)).to.eventually.eql(expected);
    });
  
    it('should work on arrays', async () => {
      await expect(maxBy(toAsync(pred), objs)).to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(maxBy(toAsync(pred))(iterator)).to.eventually.eql(expected);
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
  
    it('should return max item after pred', async () => {
      await expect(minBy(toAsync(pred), iterator))
        .to.eventually.eql(expected);
    });
  
    it('should work on arrays', async () => {
      await expect(minBy(toAsync(pred), objs))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(minBy(toAsync(pred))(iterator))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('next', () => {
  
    it('should return the next value in the iterator', async () => {
      const yields = [
        await next(iterator),
        await next(iterator),
        await next(iterator),
        await next(iterator),
      ];
      expect(yields).to.eql([
        arr[0],
        arr[1],
        arr[2],
        arr[3],
      ]);
    });
  
    it('should return the next value in the iterator', async () => {
      await expect(next(iterator)).to.eventually.eql(R.head(arr));
    });
  
    it('should advance the iterator', async () => {
      await next(iterator);
      await expect(toArray(iterator)).to.eventually.eql(arr.slice(1));
    });
  
    xit('should return ? for arrays', async () => {
      await expect(next(arr)).to.eventually.eql();
    });
  
    it('should throw StopIteration if the iterator is exhausted', async () => {
      await exhaust(iterator);
      await expect(next(iterator))
        .to.eventually.be.rejectedWith(StopIteration);
    });
  
  });
  
  describe('none', () => {
  
    beforeEach(() => {
      pred = n => n < Infinity;
    });
  
    it('should return false if any item passes the predicate', async () => {
      await expect(none(toAsync(pred), iterator)).to.eventually.eql(false);
    });
  
    it('should return true if no items pass the predicate', async () => {
      pred = n => n > Infinity;
      await expect(none(toAsync(pred), iterator)).to.eventually.eql(true);
    });
  
    it('should return true for empty iterators', async () => {
      await expect(none(toAsync(pred), of())).to.eventually.eql(true);
    });
  
    it('should be curried', async () => {
      await expect(none(toAsync(pred))(iterator)).to.eventually.eql(false);
    });
  
  });
  
  describe('nth', () => {
  
    let index;
    beforeEach(() => {
      index = random(0, arr.length - 1);
      expected = R.nth(index, arr);
    });
  
    it('should return the nth item', async () => {
      await expect(nth(index, iterator))
        .to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      await expect(nth(index, arr))
        .to.eventually.eql(expected);
    });
  
    xit('should work with negative indices', async () => {
      await expect(nth(-index, iterator))
        .to.eventually.eql(R.nth(-index, arr));
    });
  
    it('should be curried', async () => {
      await expect(nth(index)(iterator))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('of', () => {
  
    it('should yield arguments', async () => {
      expect(isAsyncIterable(of(...arr))).to.eql(true);
      expect(isIterator(of(...arr))).to.eql(true);
      expect(await toArray(of(...arr))).to.eql(arr);
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
  
    it('should pad to infinity', async () => {
      await expect(toArray(take(n, iterator))).to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(toArray(take(n)(iterator))).to.eventually.eql(expected);
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
  
    it('should return iterator of length n', async () => {
      await expect(length(iterator))
        .to.eventually.eql(n);
    });
  
    it('should pad to length of n', async () => {
      await expect(toArray(iterator))
        .to.eventually.eql(expected);
    });
  
    it('should not truncate when n < iterable length', async () => {
      iterator = padTo(2, padItem, from(arr));
      await expect(toArray(iterator))
        .to.eventually.eql(arr);
    });
  
    it('should be curried', async () => {
      await expect(toArray(padTo(n)(padItem)(from(arr))))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('partition', () => {
  
    beforeEach(() => {
      pred = n => n % 2;
    });
  
    it('should bifurcate by pred', async () => {
      await expect(mapP(toArray, partition(toAsync(pred), iterator)))
        .to.eventually.eql(R.partition(pred, arr));
    });
  
    it('should be curried', async () => {
      await expect(mapP(toArray, partition(toAsync(pred))(iterator)))
        .to.eventually.eql(R.partition(pred, arr));
    });
  
  });
  
  describe('prepend', () => {
  
    let item;
    beforeEach(() => {
      item = 'test';
      expected = R.prepend(item, arr);
    });
  
    it('should prepend an element', async () => {
      await expect(toArray(prepend(item, iterator)))
        .to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      await expect(toArray(prepend(item, arr)))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(toArray(prepend(item)(iterator)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('range', () => {
  
    let iterator;
    beforeEach(() => {
      arr = R.range(0, 10);
      iterator = from(arr);
      expected = arr;
    });
  
    it('should create an iterator of numbers with inclusive start and exclusive end', async () => {
      await expect(toArray(iterator))
        .to.eventually.eql(expected);
    });
  
    it('should work with infinite sequences', async () => {
      const len = 100;
      const infinite = range(0, Infinity);
      const first = take(len, infinite);
      await expect(toArray(first))
        .to.eventually.eql(R.range(0, len));
    });
  
    it('should be curried', async () => {
      await expect(toArray(range(0)(10)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('rangeStep', () => {
  
    describe('positive step', () => {
  
      it('should have an inclusive start and exlusive end', async () => {
        await expect(toArray(rangeStep(1.25, 15, 30)))
          .to.eventually.eql([15, 16.25, 17.5, 18.75, 20, 21.25, 22.5, 23.75, 25, 26.25, 27.5, 28.75]);
      });
  
      it('should yield no elements if start > end', async () => {
        await expect(toArray(rangeStep(1.25, 30, 15)))
          .to.eventually.eql([]);
      });
  
    });
  
    describe('negative step', () => {
  
      it('should have an inclusive start and exlusive end', async () => {
        await expect(toArray(rangeStep(-1.75, 40, 20)))
          .to.eventually.eql([40, 38.25, 36.5, 34.75, 33, 31.25, 29.5, 27.75, 26, 24.25, 22.5, 20.75]);
      });
  
      it('should yield no elements if start < end', async () => {
        await expect(toArray(rangeStep(-1.75, 20, 40)))
          .to.eventually.eql([]);
      });
  
    });
  
    it('should return an empty iterable when step = 0', async () => {
      // asc
      await expect(toArray(rangeStep(0, 20, 40))).to.eventually.eql([]);
      // desc
      await expect(toArray(rangeStep(0, 80, 40))).to.eventually.eql([]);
    });
  
    it('should be curried', async () => {
      await expect(toArray(rangeStep(5)(15)(30)))
        .to.eventually.eql([15, 20, 25]);
    });
  
  });
  
  describe('reduce', () => {
  
    beforeEach(async () => {
      pred = R.add;
      expected = await reduceP(pred, 0, arr);
    });
  
    it('should reduce iterator into accumulator', async () => {
      await expect(reduce(toAsync(pred), 0, iterator))
        .to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      await expect(reduce(toAsync(pred), 0, arr))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', () => {
      expect(reduce(toAsync(pred))(0)(iterator))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('reject', () => {
  
    beforeEach(() => {
      pred = num => num % 2;
      expected = R.reject(pred, arr);
    });
  
    it('should yield items that do not pass the predicate', async () => {
      await expect(toArray(reject(toAsync(pred), iterator)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('repeat', () => {
  
    let n;
    beforeEach(() => {
      n = random(1, 20);
    });
  
    it('should repeat the input infinitely', async () => {
      const thing = { test: true };
      const taken = toArray(take(n, repeat(thing)));
      await expect(taken).to.eventually.eql(R.times(() => thing, n));
    });
  
  });
  
  describe('reverse', () => {
  
    it('should reverse the iterator', async () => {
      await expect(toArray(reverse(iterator)))
        .to.eventually.eql(R.reverse(arr));
    });
  
  });
  
  describe('scan', () => {
  
    beforeEach(() => {
      pred = R.add;
    });
  
    it('should yield intermediate reductions', async () => {
      await expect(toArray(scan(toAsync(pred), 1, iterator)))
        .to.eventually.eql(R.scan(pred, 1, arr));
    });
  
    it('should be curried', async () => {
      await expect(toArray(scan(toAsync(pred))(1)(iterator)))
        .to.eventually.eql(R.scan(pred, 1, arr));
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
  
    it('should slice between indexes', async () => {
      const sliced = slice(start, end, iterator);
      await expect(toArray(sliced)).to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      const sliced = slice(start, end, arr);
      await expect(toArray(sliced)).to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      const sliced = slice(start)(end)(iterator);
      await expect(toArray(sliced)).to.eventually.eql(expected);
    });
  
  });
  
  describe('some', () => {
  
    beforeEach(() => {
      pred = n => n > 5;
      expected = R.any(pred, arr);
    });
  
    it('should return true if any item passes the predicate', async () => {
      await expect(some(toAsync(pred), iterator))
        .to.eventually.eql(expected);
    });
  
    it('should return false if any item does not pass the predicate', async () => {
      pred = n => n > Infinity;
      await expect(some(toAsync(pred), iterator))
        .to.eventually.eql(R.any(pred, arr));
    });
  
    it('should return false for empty iterators', async () => {
      await expect(some(toAsync(pred), of()))
        .to.eventually.eql(false);
    });
  
    it('should be curried', async () => {
      await expect(some(toAsync(pred))(iterator))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('splitAt', () => {
  
    let n;
    beforeEach(() => {
      n = random(0, arr.length - 1);
    });
  
    it('should split iterator at the nth element', async () => {
      const [left, right] = splitAt(n, iterator);
      const [leftArr, rightArr] = R.splitAt(n, arr);
      
      await expect(toArray(left))
        .to.eventually.eql(leftArr);
        
      await expect(toArray(right))
        .to.eventually.eql(rightArr);
    });
  
  });
  
  describe('splitEvery', () => {
  
    let n;
    beforeEach(() => {
      n = random(1, 10);
    });
  
    it('should split iterator every n yields', async () => {
      await expect(toArray(splitEvery(n, iterator)))
        .to.eventually.eql(R.splitEvery(n, arr));
    });
  
    it('should be curried', async () => {
      await expect(toArray(splitEvery(n)(iterator)))
        .to.eventually.eql(R.splitEvery(n, arr));
    });
  
  });
  
  describe('sum', () => {
  
    beforeEach(() => {
      expected = R.reduce(R.add, 0, arr);
    });
  
    it('should sum the iterator', async () => {
      await expect(sum(iterator)).to.eventually.eql(expected);
    });
  
    it('should with with arrays', async () => {
      await expect(sum(arr)).to.eventually.eql(expected);
    });
  
  });
  
  describe('take', () => {
  
    let n;
    beforeEach(() => {
      n = random(0, arr.length - 1);
      expected = R.take(n, arr);
    });
  
    it('should yield the first n items', async () => {
      await expect(toArray(take(n, iterator)))
        .to.eventually.eql(expected);
    });
  
    it('should yield nothing if n <= 0 ', async () => {
      await expect(toArray(take(-1, iterator)))
        .to.eventually.eql([]);
    });
  
    it('should work with arrays', async () => {
      await expect(toArray(take(n, arr)))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(toArray(take(n)(iterator)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('takeWhile', () => {
  
    beforeEach(() => {
      arr = R.range(50, 500);
      iterator = from(arr);
      pred = n => (n < 175 || n > 200);
      expected = R.takeWhile(pred, arr);
    });
  
    it('should take items while pred is true', async () => {
      await expect(toArray(takeWhile(toAsync(pred), iterator)))
        .to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      await expect(toArray(takeWhile(toAsync(pred), arr)))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(toArray(takeWhile(toAsync(pred))(iterator)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('tee', () => {
  
    let n, copies;
    beforeEach(() => {
      arr = R.range(0, 2);
      iterator = from(arr);
      n = 10;
      copies = tee(n, iterator);
      expected = [...Array(n)].map(() => arr);
    });
  
    it('should return n copies', async () => {
      expect(copies.length).to.eql(n);
      for (const copy of copies) {
        expect(isAsyncIterable(copy)).to.eql(true);
        expect(isIterator(copy)).to.eql(true);
        await expect(toArray(copy))
          .to.eventually.eql(arr);
      }
    });
  
    it('should exhaust the input iterator when one copy is exhausted', async () => {
      tee(n, iterator);
      await expect(toArray(iterator)).to.eventually.eql(arr);
  
      iterator = from(arr);
      const [copy] = tee(n, iterator);
      await exhaust(copy);
      await expect(toArray(iterator)).to.eventually.eql([]);
    });
  
    it('should be curried', async () => {
      await expect(mapP(toArray, tee(n)(iterator)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('times', () => {
  
    beforeEach(() => {
      expected = R.times(R.always('test'), 10);
    });
  
    it('should yield the item n times', async () => {
      await expect(toArray(times(10, 'test')))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(toArray(times(10)('test')))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('unique', () => {
  
    beforeEach(() => {
      arr = [1, 2, 3, 3, 3, 2, 1];
      iterator = from(arr);
      expected = [1, 2, 3];
    });
  
    it('should yield unique items', async () => {
      await expect(toArray(unique(iterator)))
        .to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      await expect(toArray(unique(arr)))
        .to.eventually.eql(expected);
    });
  
  });
  
  describe('uniqueWith', () => {
  
    beforeEach(() => {
      arr = [1, 2, 3, 3, 3, 2, 1].map((id) => ({ id }));
      pred = on(is, R.prop('id'));
      iterator = from(arr);
    });
  
    it('should yield unique items', async () => {
      await expect(toArray(uniqueWith(toAsync(pred), iterator)))
        .to.eventually.eql(R.uniqWith(pred, arr));
    });
  
    it('should work with arrays', async () => {
      await expect(toArray(uniqueWith(toAsync(pred), arr)))
        .to.eventually.eql(R.uniqWith(pred, arr));
    });
  
    it('should be curried', async () => {
      await expect(toArray(uniqueWith(toAsync(pred))(iterator)))
        .to.eventually.eql(R.uniqWith(pred, arr));
    });
  
  });
  
  describe('unfold', () => {
  
    beforeEach(() => {
      pred = n => (n > 50 ? false : [-n, n + 10]);
    });
  
    it('should yield until a falsey value is returned', async () => {
      await expect(toArray(unfold(toAsync(pred), 10)))
        .to.eventually.eql(R.unfold(pred, 10));
    });
  
    it('should be curried', async () => {
      await expect(toArray(unfold(toAsync(pred))(10)))
        .to.eventually.eql(R.unfold(pred, 10));
    });
  
  });
  
  describe('unnest', () => {
  
    it('should flatten one level', async () => {
      arr = [1, [2, 3, [4, 5, 6], [7, 8, 9, [12, 13, 14]]], [9, 10, 11]];
      iterator = from(arr);
      await expect(toArray(unnest(iterator)))
        .to.eventually.eql(R.unnest(arr));
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
  
    it('should unzip tuples', async () => {
      const zipped = zip(range1, range2);
      const [left, right] = unzip(zipped);
      await expect(toArray(left)).to.eventually.eql(arr1);
      await expect(toArray(right)).to.eventually.eql(arr2);
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
  
    it('should unzip n-pls', async () => {
      const iterators = unzipN(n, iterator);
      iterators.forEach((it) => {
        expect(isAsyncIterable(it)).to.eql(true);
        expect(isIterator(it)).to.eql(true);
      });
      await expect(mapP(toArray, iterators))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(mapP(toArray, unzipN(n)(iterator)))
        .to.eventually.eql(expected);
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
  
    it('should yield pairs until the shortest iterator is exhausted', async () => {
      await expect(toArray(zip(iter1, iter2)))
        .to.eventually.eql(expected);
    });
  
    it('should work with arrays', async () => {
      await expect(toArray(zip(range1, range2)))
        .to.eventually.eql(expected);
    });
  
    it('should be curried', async () => {
      await expect(toArray(zip(iter1)(iter2)))
        .to.eventually.eql(expected);
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
        .map((_, i) => pred(...arrays.map(R.nth(i))));
    });
  
    it('should zip iterables', async () => {
      await expect(toArray(zipAllWith(toAsync(pred), iterables)))
        .to.eventually.eql(expected);
    });
    
    it('should work with arrays', async () => {
      await expect(toArray(zipAllWith(toAsync(pred), arrays)))
        .to.eventually.eql(expected);
    });
    
    it('should be curried', async () => {
      await expect(toArray(zipAllWith(toAsync(pred))(iterables)))
        .to.eventually.eql(expected);
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
  
    it('should yield items returned from predicate', async () => {
      await expect(toArray(zipWith(toAsync(pred), iter1, iter2)))
        .to.eventually.eql(R.zipWith(pred, range1, range2));
    });
  
  });
  
});
