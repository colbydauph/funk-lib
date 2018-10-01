'use strict';

const R = require('ramda');

class StopIteration extends Error {}

// ((A, T) -> A) -> A -> Iterable<T> -> A
const reduce = R.curry((pred, acc, iterable) => {
  for (const item of iterable) acc = pred(acc, item);
  return acc;
});

// (A -> B) -> Iterable<A> -> Iterator<B>
const map = R.curry(function* map(pred, iterable) {
  for (const item of iterable) yield pred(item);
});

// (A -> Iterable<B>) -> Iterable<A> -> Iterator<B>
const flatMap = R.curry(function* flatMap(pred, iterable) {
  for (const item of iterable) yield* pred(item);
});

// returns an iterator from an iterable
// Iterable<T> -> Iterator<T>
const from = map(R.identity);

// create an iterator of one or more (variadic) arguments
// T... -> Iterator<T>
const of = R.unapply(from);

// Iterable<T> -> Iterable<T> -> Iterable<T>
const concat = R.curry(function* concat(iterator1, iterator2) {
  yield* iterator1;
  yield* iterator2;
});

// T -> Iterable<T> -> Iterator<T>
const prepend = R.useWith(concat, [of, R.identity]);

// T -> Iterable<T> -> Iterator<T>
const append = R.useWith(R.flip(concat), [of, R.identity]);

// (T -> *) -> Iterable<T> -> Iterator<T>
const forEach = R.curry(function* forEach(pred, iterable) {
  // eslint-disable-next-line no-unused-expressions
  for (const item of iterable) pred(item), yield item;
});

// (T -> Boolean) -> Iterable<T> -> Iterator<T>
const filter = R.curry(function* filter(pred, Iterable) {
  for (const item of Iterable) if (pred(item)) yield item;
});

// ((A, T) -> A) -> Iterable<T> -> Iterator<A>
const accumulate = R.curry(function* accumulate(pred, iterable) {
  const INIT = Symbol('INIT');
  let last = INIT;
  for (const item of iterable) {
    yield (last = (last === INIT) ? item : pred(last, item));
  }
});

// Iterable<A> -> Iterable<B> -> Iterator<[A, B]>
const zip = R.useWith(function* zip(iterable1, iterable2) {
  while (true) {
    const { value: value1, done: done1 } = iterable1.next();
    const { value: value2, done: done2 } = iterable2.next();
    if (done1 || done2) return;
    yield [value1, value2];
  }
}, [from, from]);

// Number -> Number -> Number -> Iterator<Number>
const rangeStep = R.curry(function* rangeStep(step, start, stop) {
  const cont = i => (step > 0 ? i < stop : i > stop);
  for (let i = start; cont(i); i += step) yield i;
});

// Number -> Number -> Iterator<Number>
const range = rangeStep(1);

// todo: should this be called entries?
// Iterable<T> -> Iterator<[Integer, T]>
const enumerate = (iterable) => zip(range(0, Infinity), iterable);

// todo: maybe this is iterateFrom or repeatFrom
// (T -> T) -> T -> Iterator<T>
const iterateWith = R.curry(function* iterateWith(pred, item) {
  yield item;
  while (true) yield item = pred(item);
});

// Integer -> T -> Iterator<T>
const times = R.curry(function* times(num, thing) {
  while (num-- > 0) yield thing;
});

// T -> Iterator<T>
const repeat = times(Infinity);

// Iterable<T> -> Iterator<T>
const unique = function* unique(iterable) {
  const set = new Set();
  yield* filter((item) => {
    if (set.has(item)) return;
    set.add(item);
    return true;
  }, iterable);
};

// Integer -> Integer -> Iterable<T> -> Iterator<T>
const slice = R.curry(function* slice(start, stop, iterable) {
  for (const [i, item] of enumerate(iterable)) {
    if (i >= start) yield item;
    if (i >= stop - 1) return;
  }
});

// Integer -> Iterable<T> -> Iterator<T>
const take = slice(0);

// Integer -> Iterable<T> -> Iterator<T>
const drop = R.curry((num, iterable) => slice(num, Infinity, iterable));

// Iterable<T> -> T
const next = (iterable) => {
  const { value, done } = iterable.next();
  if (done) throw new StopIteration();
  return value;
};

// Iterable<T> -> Integer
const length = reduce(R.add(1), 0);

// Iterable<Number> -> Number
const sum = reduce(R.add, 0);

// Iterable<T> -> [T]
const toArray = reduce(R.flip(R.append), []);

// Integer -> Iterable<T> -> T
const nth = R.curry((num, iterable) => {
  for (const [i, item] of enumerate(iterable)) {
    if (i === num) return item;
  }
});

// (T -> Boolean) -> Iterable<T> -> Boolean
const some = R.curry((pred, iterable) => {
  for (const item of iterable) if (pred(item)) return true;
  return false;
});

// (T -> Boolean) -> Iterable<T> -> Boolean
const every = R.curry((pred, iterable) => {
  for (const item of iterable) if (!pred(item)) return false;
  return true;
});

// (T -> Boolean) -> Iterable<T> -> T | Undefined
const find = R.curry((pred, iterable) => {
  for (const item of iterable) if (pred(item)) return item;
});

// Iterable<T> -> Undefined
const exhaust = (iterable) => {
  // eslint-disable-next-line no-unused-vars
  for (const item of iterable);
};

// (T -> Boolean) -> Iterable<T> -> Iterator<T>
const takeWhile = R.curry(function* takeWhile(pred, iterable) {
  for (const item of iterable) {
    if (!pred(item)) return;
    yield item;
  }
});

// (T -> Boolean) -> Iterable<T> -> Iterator<T>
const dropWhile = R.curry(function* dropWhile(pred, iterable) {
  const iterator = from(iterable);
  for (const item of iterator) {
    if (!pred(item)) return yield* prepend(item, iterator);
  }
});

// todo: this can be implemented with chain + times
// Integer -> Iterable<T> -> Iterator<T>
const cycleN = R.curry(function* cycleN(n, iterable) {
  if (n < 1) return;
  const buffer = [];
  yield* forEach((item) => buffer.push(item), iterable);
  if (!buffer.length) return;
  while (n-- > 1) yield* buffer;
});

// Iterable<T> -> Iterator<T>
const cycle = cycleN(Infinity);

// todo: there might be a more efficient strategy for arrays
// generators are not iterable in reverse
// Iterable<T> -> Iterator<T>
const reverse = R.pipe(toArray, R.reverse);

// ((T, T) -> Number) -> Iterable<T> -> Iterator<T>
const sort = R.useWith(R.sort, [R.identity, toArray]);

// Integer -> Iterable<T> -> Iterator<[T]>
const frame = R.curry(function* frame(size, iterable) {
  const cache = [];
  for (const item of iterable) {
    if (cache.length === size) {
      yield [...cache];
      cache.shift();
    }
    cache.push(item);
  }
  yield cache;
});

// T -> Iterable<T> -> Integer
const indexOf = R.curry((toFind, iterable) => {
  for (const [i, item] of enumerate(iterable)) {
    if (item === toFind) return i;
  }
  return -1;
});

// * -> Iterable<T> -> Boolean
const includes = R.curry((item, iterable) => indexOf(item, iterable) > -1);

// (T -> T -> Boolean) -> Iterable<T> -> Iterator<[T]>
const groupWith = R.curry(function* groupWith(pred, iterable) {
  const INIT = Symbol('INIT');
  let last = INIT, group = [];
  for (const item of iterable) {
    if (last !== INIT && !pred(last, item)) {
      yield group;
      group = [];
    }
    group.push(last = item);
  }
  if (group.length) yield group;
});

// Integer -> Iterable<T> -> [Iterator<T>]
const tee = R.curry((n, iterator) => {
  iterator = from(iterator);
  const caches = [...Array(n)].map(() => []);
  
  return caches.map(function* gen(cache) {
    while (true) {
      if (!cache.length) {
        const { done, value } = iterator.next();
        if (done) return;
        for (const cache of caches) cache.push(value);
      }
      yield cache.shift();
    }
  });
});

// Integer -> Iterable<T> -> Iterator<[T]>
const splitEvery = R.curry(function* splitEvery(n, iterable) {
  let group = [];
  for (const item of iterable) {
    group.push(item);
    if (group.length === n) {
      yield group;
      group = [];
    }
  }
  if (group.length) yield group;
});

// (T -> Boolean) -> Iterable<T> -> [Iterable<T>, Iterable<T>]
const partition = R.curry((pred, iterable) => {
  const [pass, fail] = tee(2, iterable);
  return [
    filter(pred, pass),
    filter(R.complement(pred), fail),
  ];
});


module.exports = {
  accumulate,
  append,
  concat,
  cycle,
  cycleN,
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
  includes,
  indexOf,
  iterateWith,
  length,
  map,
  next,
  nth,
  of,
  partition,
  prepend,
  range,
  rangeStep,
  reduce,
  repeat,
  reverse,
  slice,
  some,
  sort,
  splitEvery,
  StopIteration,
  sum,
  take,
  takeWhile,
  tee,
  times,
  toArray,
  unique,
  zip,
};
