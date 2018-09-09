'use strict';

const R = require('ramda');

// const reduceYieldSync

// ((A, T) -> A) -> Iterable<T> -> A -> A
const reduceSync = R.curry((pred, acc, iterable) => {
  for (const item of iterable) acc = pred(acc, item);
  return acc;
});

// (A -> B) -> Iterable<A> -> Iterable<B>
const mapSync = R.curry(function* mapSync(pred, iterable) {
  for (const item of iterable) yield pred(item);
});

// todo: figure out how to annotate these types
const flatMapSync = R.curry(function* flatMapSync(pred, iterable) {
  for (const item of iterable) yield* pred(item);
});

// (T -> *) -> Iterable<T> -> Iterable<T>
const forEachSync = R.curry(function* forEachSync(pred, iterable) {
  for (const item of iterable) {
    pred(item);
    yield item;
  }
});

// (T -> Boolean) -> Iterable<T> -> Iterable<T>
const filterSync = R.curry(function* filterSync(pred, iterable) {
  for (const item of iterable) {
    if (pred(item)) yield item;
  }
});

// ((B, A) -> B) -> Iterable<A> -> Iterable<B>
const accumulateSync = R.curry(function* accumulate(pred, iterable) {
  let last;
  for (const item of iterable) {
    last = last ? pred(last, item) : item;
    yield last;
  }
});

// Iterable<T> -> Iterable<Tuple<T, Integer>>
const enumerateSync = function* enumerateSync(iterable) {
  let i = 0;
  yield* mapSync((item) => [item, i++], iterable);
};

// Integer -> Integer -> Iterable<T>
const rangeSync = R.curry(function* rangeSync(start, end) {
  while (start < end) yield start++;
});

// Integer -> T -> Iterable<T>
const timesSync = R.curry(function* timesSync(num, thing) {
  while (num-- > 0) yield thing;
});

// T -> Iterable<T>
const repeatSync = timesSync(Infinity);

// Iterable<T> -> Iterable<T>
const uniqueSync = function* uniqueSync(iterable) {
  const set = new Set();
  yield* filterSync((item) => {
    if (set.has(item)) return;
    set.add(item);
    return true;
  }, iterable);
};

// Iterable<A> -> Iterable<B> -> Iterable<Tuple<A, B>>
const zipSync = R.curry(function* zipSync(iterable1, iterable2) {
  while (true) {
    const { value: value1, done: done1 } = iterable1.next();
    const { value: value2, done: done2 } = iterable2.next();
    if (done1 || done2) return;
    yield [value1, value2];
  }
});

// Integer -> Integer -> Iterable<T> -> Iterable<T>
const sliceSync = R.curry(function* sliceSync(start, stop, iterable) {
  for (const [item, i] of enumerateSync(iterable)) {
    if (i >= start) yield item;
    if (i >= stop - 1) return;
  }
});

// Integer -> Iterable<T> -> Iterable<T>
const takeSync = R.curry(function* takeSync(num, iterable) {
  for (const [item, i] of enumerateSync(iterable)) {
    yield item;
    if ((i + 1) >= num) return;
  }
});

// Integer -> Iterable<T> -> Iterable<T>
const dropSync = R.curry(function* takeSync(num, iterable) {
  for (const [item, i] of enumerateSync(iterable)) {
    if (i >= num) yield item;
  }
});

// Iterable<T> -> T
const nextSync = (iterable) => {
  const { value, done } = iterable.next();
  if (done) throw Error('iterable exhausted');
  return value;
};

// * -> Iterable<T> -> Boolean
const includesSync = R.curry(async (it, iterable) => {
  for (const item of iterable) {
    if (it === item) return true;
  }
  return false;
});

// Iterable<T> -> Integer
const lengthSync = reduceSync(R.add(1), 0);

// Iterable<N> -> N
const sumSync = reduceSync(R.add, 0);

// Iterable<T> -> Array<T>
const toArraySync = reduceSync(R.flip(R.append), []);

// is this more generic?
// Array<T> -> Iterable<T>
const fromArraySync = mapSync(R.identity);

// Integer -> Iterable<T> -> T
const nthSync = R.curry((num, iterable) => {
  for (const [item, i] of enumerateSync(iterable)) {
    if (i >= num) return item;
  }
});

// (T -> Boolean) -> Iterable<T> -> Boolean
const someSync = R.curry(function* someSync(pred, iterable) {
  for (const item of iterable) {
    if (pred(item)) return true;
  }
  return false;
});

// (T -> Boolean) -> Iterable<T> -> Boolean
const everySync = R.curry(function* everySync(pred, iterable) {
  for (const item of iterable) {
    if (!pred(item)) return false;
  }
  return true;
});

// (T -> T) -> Iterable<T> -> T
const findSync = R.curry(function* findSync(pred, iterable) {
  for (const item of iterable) {
    if (pred(item)) return item;
  }
});

// Iterable<T> -> Iterable<T>
const exhaustSync = forEachSync(() => {});

// (T -> Boolean) -> Iterable<T> -> Iterable<T>
const takeWhileSync = R.curry(function* takeWhileSync(pred, iterable) {
  for (const item of iterable) {
    if (!pred(item)) return;
    yield item;
  }
});

// Iterable<T> -> Iterable<T>
const cycleSync = R.curry(function* cycleSync(iterable) {
  const buffer = [];
  yield* forEachSync((item) => buffer.push(item), iterable);
  if (!buffer.length) return;
  while (true) yield* buffer;
});

// Iterable<T> -> Iterable<T>
const reverseSync = R.curry(function* reverseSync(iterable) {
  yield* toArraySync(iterable).reverse();
});

// R.aperture
// eslint-disable-next-line max-statements
// Integer -> Iterable<T> -> Iterable<[T]>
const windowSync = R.curry(function* windowSync(size, iterable) {
  let cache = [];
  for (const item of iterable) {
    if (cache.length === size) {
      yield cache;
      cache = R.pipe(R.append(item), R.tail)(cache);
    } else {
      cache = [...cache, item];
    }
  }
  yield cache;
});

// Iterable<T> -> Iterable<T> -> Iterable<T>
const concatSync = R.curry(function* concatSync(iterator1, iterator2) {
  yield* iterator1;
  yield* iterator2;
});


// const takeWhileSync = () => {};
// const dropWhileSync = () => {};
// const countWhereSync = () => {};
// const chainSync = () => {};

module.exports = {
  accumulateSync,
  concatSync,
  cycleSync,
  dropSync,
  enumerateSync,
  everySync,
  exhaustSync,
  filterSync,
  findSync,
  flatMapSync,
  fromArraySync,
  includesSync,
  lengthSync,
  mapSync,
  nextSync,
  nthSync,
  rangeSync,
  reduceSync,
  repeatSync,
  reverseSync,
  sliceSync,
  someSync,
  sumSync,
  takeSync,
  takeWhileSync,
  timesSync,
  toArraySync,
  uniqueSync,
  windowSync,
  zipSync,
};
