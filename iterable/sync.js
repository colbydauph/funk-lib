'use strict';

const R = require('ramda');

class StopIteration extends Error {}

// Iterable<T> -> Iterable<T> -> Iterable<T>
const concat = R.curry(function* concat(iterator1, iterator2) {
  yield* iterator1;
  yield* iterator2;
});

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

// (T -> *) -> Iterable<T> -> Iterator<T>
const forEach = R.curry(function* forEach(pred, iterable) {
  for (const item of iterable) {
    pred(item);
    yield item;
  }
});

// (T -> Boolean) -> Iterable<T> -> Iterator<T>
const filter = R.curry(function* filter(pred, iterable) {
  for (const item of iterable) {
    if (pred(item)) yield item;
  }
});

// returns an iterator from an iterable
// Iterable<T> -> Iterator<T>
const from = map(R.identity);

// create an iterator of one or more (variadic) arguments
// T... -> Iterator<T>
const of = R.unapply(from);

// ((A, T) -> A) -> Iterable<T> -> Iterator<A>
const accumulate = R.curry(function* accumulate(pred, iterable) {
  let last;
  for (const item of iterable) {
    last = last ? pred(last, item) : item;
    yield last;
  }
});

// Iterable<T> -> Iterator<[T, Integer]>
const enumerate = function* enumerate(iterable) {
  let i = 0;
  yield* map((item) => [item, i++], iterable);
};

// (T -> T) -> T -> Iterator<T>
const iterateWith = R.curry(function* iterateWith(pred, item) {
  yield item;
  while (true) yield item = pred(item);
});

// Number -> Number -> Number -> Iterator<Number>
const rangeStep = R.curry(function* rangeStep(step, start, stop) {
  const done = i => (step > 0 ? i < stop : i > stop);
  for (let i = start; done(i); i += step) yield i;
});

// Number -> Number -> Iterator<Number>
const range = rangeStep(1);

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

// Iterable<A> -> Iterable<B> -> Iterator<[A, B]>
const zip = R.useWith(function* zip(iterable1, iterable2) {
  while (true) {
    const { value: value1, done: done1 } = iterable1.next();
    const { value: value2, done: done2 } = iterable2.next();
    if (done1 || done2) return;
    yield [value1, value2];
  }
}, [from, from]);

// Integer -> Integer -> Iterable<T> -> Iterator<T>
const slice = R.curry(function* slice(start, stop, iterable) {
  for (const [item, i] of enumerate(iterable)) {
    if (i >= start) yield item;
    if (i >= stop - 1) return;
  }
});

// Integer -> Iterable<T> -> Iterator<T>
const take = R.curry(function* take(num, iterable) {
  for (const [item, i] of enumerate(iterable)) {
    yield item;
    if ((i + 1) >= num) return;
  }
});

// Integer -> Iterable<T> -> Iterator<T>
const drop = R.curry(function* take(num, iterable) {
  for (const [item, i] of enumerate(iterable)) {
    if (i >= num) yield item;
  }
});

// Iterable<T> -> T
const next = (iterable) => {
  const { value, done } = iterable.next();
  if (done) throw StopIteration();
  return value;
};

// * -> Iterable<T> -> Boolean
const includes = R.curry(async (it, iterable) => {
  for (const item of iterable) {
    if (it === item) return true;
  }
  return false;
});

// Iterable<T> -> Integer
const length = reduce(R.add(1), 0);

// Iterable<Number> -> Number
const sum = reduce(R.add, 0);

// Iterable<T> -> [T]
const toArray = reduce(R.flip(R.append), []);

// Integer -> Iterable<T> -> T
const nth = R.curry((num, iterable) => {
  for (const [item, i] of enumerate(iterable)) {
    if (i >= num) return item;
  }
});

// (T -> Boolean) -> Iterable<T> -> Boolean
const some = R.curry((pred, iterable) => {
  for (const item of iterable) {
    if (pred(item)) return true;
  }
  return false;
});

// (T -> Boolean) -> Iterable<T> -> Boolean
const every = R.curry((pred, iterable) => {
  for (const item of iterable) {
    if (!pred(item)) return false;
  }
  return true;
});

// (T -> Boolean) -> Iterable<T> -> T | Undefined
const find = R.curry((pred, iterable) => {
  for (const item of iterable) {
    if (pred(item)) return item;
  }
});

// Iterable<T> -> Undefined
const exhaust = (iterable) => {
  // eslint-disable-next-line no-unused-vars
  for (const item of iterable) { /* do nothing */ }
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
  let done = false;
  for (const item of iterable) {
    if (!pred(item)) {
      done = true;
    } else {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (done) yield item;
  }
});

// Iterable<T> -> Iterator<T>
const cycle = function* cycle(iterable) {
  const buffer = [];
  yield* forEach((item) => buffer.push(item), iterable);
  if (!buffer.length) return;
  while (true) yield* buffer;
};

// Iterable<T> -> Iterator<T>
const reverse = function* reverse(iterable) {
  yield* toArray(iterable).reverse();
};

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
const indexOf = R.curry(function* indexOf(toFind, iterable) {
  for (const [item, i] of enumerate(iterable)) {
    if (item === toFind) return i;
  }
  return -1;
});

// (T -> T -> Boolean) -> Iterable<T> -> Iterator<[T]>
const groupWith = R.curry(function* groupWith(pred, iterable) {
  for (const item of iterable) {
    console.log(item);
  }
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


module.exports = {
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
  includes,
  indexOf,
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
  reverse,
  slice,
  some,
  splitEvery,
  sum,
  take,
  takeWhile,
  tee,
  times,
  toArray,
  unique,
  zip,
};
