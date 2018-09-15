'use strict';

const R = require('ramda');


// Iterable<T> -> Iterable<T> -> Iterable<T>
const concat = R.curry(function* concat(iterator1, iterator2) {
  yield* iterator1;
  yield* iterator2;
});

// ((A, T) -> A) -> Iterable<T> -> A -> A
const reduce = R.curry((pred, acc, iterable) => {
  for (const item of iterable) acc = pred(acc, item);
  return acc;
});

// (A -> B) -> Iterable<A> -> Iterable<B>
const map = R.curry(function* map(pred, iterable) {
  for (const item of iterable) yield pred(item);
});

// (T *-> T) -> Iterable<T> -> Iterable<T>
const flatMap = R.curry(function* flatMap(pred, iterable) {
  for (const item of iterable) yield* pred(item);
});

// (T -> *) -> Iterable<T> -> Iterable<T>
const forEach = R.curry(function* forEach(pred, iterable) {
  for (const item of iterable) {
    pred(item);
    yield item;
  }
});

// (T -> Boolean) -> Iterable<T> -> Iterable<T>
const filter = R.curry(function* filter(pred, iterable) {
  for (const item of iterable) {
    if (pred(item)) yield item;
  }
});

// ((B, A) -> B) -> Iterable<A> -> Iterable<B>
const accumulate = R.curry(function* accumulate(pred, iterable) {
  let last;
  for (const item of iterable) {
    last = last ? pred(last, item) : item;
    yield last;
  }
});

// todo: should tuple be reversed? to match entries?
// Iterable<T> -> Iterable<Tuple<T, Integer>>
const enumerate = function* enumerate(iterable) {
  let i = 0;
  yield* map((item) => [item, i++], iterable);
};

// Integer -> Integer -> Iterable<T>
const range = R.curry(function* range(start, end) {
  while (start < end) yield start++;
});

// Integer -> T -> Iterable<T>
const times = R.curry(function* times(num, thing) {
  while (num-- > 0) yield thing;
});

// T -> Iterable<T>
const repeat = times(Infinity);

// Iterable<T> -> Iterable<T>
const unique = function* unique(iterable) {
  const set = new Set();
  yield* filter((item) => {
    if (set.has(item)) return;
    set.add(item);
    return true;
  }, iterable);
};

// Iterable<A> -> Iterable<B> -> Iterable<Tuple<A, B>>
const zip = R.curry(function* zip(iterable1, iterable2) {
  while (true) {
    const { value: value1, done: done1 } = iterable1.next();
    const { value: value2, done: done2 } = iterable2.next();
    if (done1 || done2) return;
    yield [value1, value2];
  }
});

// Integer -> Integer -> Iterable<T> -> Iterable<T>
const slice = R.curry(function* slice(start, stop, iterable) {
  for (const [item, i] of enumerate(iterable)) {
    if (i >= start) yield item;
    if (i >= stop - 1) return;
  }
});

// Integer -> Iterable<T> -> Iterable<T>
const take = R.curry(function* take(num, iterable) {
  for (const [item, i] of enumerate(iterable)) {
    yield item;
    if ((i + 1) >= num) return;
  }
});

// Integer -> Iterable<T> -> Iterable<T>
const drop = R.curry(function* take(num, iterable) {
  for (const [item, i] of enumerate(iterable)) {
    if (i >= num) yield item;
  }
});

// Iterable<T> -> T
const next = (iterable) => {
  const { value, done } = iterable.next();
  if (done) throw Error('iterator exhausted');
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

// Iterable<N> -> N
const sum = reduce(R.add, 0);

// Iterable<T> -> Array<T>
const toArray = reduce(R.flip(R.append), []);

// returns an async iterator for an iterable
// Iterable<T> -> AsyncIterable<T>
const from = map(R.identity);

// create a async iterator from one or more (variadic) arguments
// T -> AsyncIterable<T>
const of = R.unapply(from);

// Integer -> Iterable<T> -> T
const nth = R.curry((num, iterable) => {
  for (const [item, i] of enumerate(iterable)) {
    if (i >= num) return item;
  }
});

// (T -> Boolean) -> Iterable<T> -> Boolean
const some = R.curry(function* some(pred, iterable) {
  for (const item of iterable) {
    if (pred(item)) return true;
  }
  return false;
});

// (T -> Boolean) -> Iterable<T> -> Boolean
const every = R.curry(function* every(pred, iterable) {
  for (const item of iterable) {
    if (!pred(item)) return false;
  }
  return true;
});

// (T -> T) -> Iterable<T> -> T
const find = R.curry(function* find(pred, iterable) {
  for (const item of iterable) {
    if (pred(item)) return item;
  }
});

// Iterable<T> -> Iterable<T>
const exhaust = R.curry(function* exhaust(iterable) {
  // eslint-disable-next-line no-unused-vars
  for (const item of iterable) { /* do nothing */ }
});

// (T -> Boolean) -> Iterable<T> -> Iterable<T>
const takeWhile = R.curry(function* takeWhile(pred, iterable) {
  for (const item of iterable) {
    if (!pred(item)) return;
    yield item;
  }
});

// (T -> Boolean) -> Iterable<T> -> Iterable<T>
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

// Iterable<T> -> Iterable<T>
const cycle = R.curry(function* cycle(iterable) {
  const buffer = [];
  yield* forEach((item) => buffer.push(item), iterable);
  if (!buffer.length) return;
  while (true) yield* buffer;
});

// Iterable<T> -> Iterable<T>
const reverse = R.curry(function* reverse(iterable) {
  yield* toArray(iterable).reverse();
});

// R.aperture
// eslint-disable-next-line max-statements
// Integer -> Iterable<T> -> Iterable<[T]>
const frame = R.curry(function* frame(size, iterable) {
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

// T -> Iterable<T> -> Integer
const indexOf = R.curry(function* indexOf(toFind, iterable) {
  for (const [item, i] of enumerate(iterable)) {
    if (item === toFind) return i;
  }
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
  includes,
  indexOf,
  length,
  map,
  next,
  nth,
  of,
  range,
  reduce,
  repeat,
  reverse,
  slice,
  some,
  sum,
  take,
  takeWhile,
  times,
  toArray,
  unique,
  zip,
};
