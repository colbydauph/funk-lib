'use strict';

// modules
const R = require('ramda');

// local
const { pipeC } = require('../function');
const { isIterable } = require('../is');

const strictEqual = R.curry((left, right) => (left === right));

class StopIteration extends Error {}

// * -> Iterable<T> -> T | *
const nextOr = R.curry((or, iterable) => {
  const { value, done } = iterable.next();
  return done ? or : value;
});

// todo: this is also "head" and "first"
// Iterable<T> -> T
const next = (iterable) => {
  const err = new StopIteration();
  const out = nextOr(err, iterable);
  if (out === err) throw err;
  return out;
};

// Iterable<T> -> T
const last = (iterable) => {
  let last;
  for (const item of iterable) last = item;
  return last;
};

// ((A, T) -> A) -> A -> Iterable<T> -> Iterator<A>
const scan = R.curry(function* scan(pred, acc, iterable) {
  yield acc;
  for (const item of iterable) yield acc = pred(acc, item);
});

// ((A, T) -> A) -> A -> Iterable<T> -> A
const reduce = pipeC(scan, last);

// accumulate is to scan, like reduce with no init
// todo: consider ditching this. scan is more useful
// ((A, T) -> A) -> Iterable<T> -> Iterator<A>
const accumulate = R.curry(function* accumulate(pred, iterable) {
  const INIT = Symbol('INIT');
  let last = INIT;
  for (const item of iterable) {
    yield (last = (last === INIT) ? item : pred(last, item));
  }
});

// (A -> B) -> Iterable<A> -> Iterator<B>
const map = R.curry(function* map(pred, iterable) {
  for (const item of iterable) yield pred(item);
});

// (A -> Iterable<B>) -> Iterable<A> -> Iterator<B>
const flatMap = R.curry(function* flatMap(pred, iterable) {
  for (const item of iterable) yield* pred(item);
});

// Integer -> Integer -> Iterable<T> -> Iterator<T>
const slice = R.curry(function* slice(start, stop, iterable) {
  for (const [i, item] of enumerate(iterable)) {
    if (i >= start) yield item;
    if (i >= stop - 1) return;
  }
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

// (T -> Boolean) -> Iterable<T> -> Iterator<T>
const reject = R.complement(filter);

// ((A, B) -> C) -> Iterable<A> -> Iterable<B> -> Iterator<C>
const zipWith = R.useWith(function* zipWith(pred, iterator1, iterator2) {
  while (true) {
    const { value: value1, done: done1 } = iterator1.next();
    const { value: value2, done: done2 } = iterator2.next();
    if (done1 || done2) return;
    yield pred(value1, value2);
  }
}, [R.identity, from, from]);

// Iterable<A> -> Iterable<B> -> Iterator<[A, B]>
const zip = zipWith(Array.of);

// todo: test with step = 0
// Number -> Number -> Number -> Iterator<Number>
const rangeStep = R.curry(function* rangeStep(step, start, stop) {
  const cont = i => (step > 0 ? i < stop : i > stop);
  for (let i = start; cont(i); i += step) yield i;
});

// Number -> Number -> Iterator<Number>
const range = rangeStep(1);

// todo: should this be called entries?
// Iterable<T> -> Iterator<[Integer, T]>
const enumerate = iterable => zip(range(0, Infinity), iterable);

// (A -> [B]) -> * -> Iterator<B>
const unfold = R.curry(function* unfold(pred, item) {
  let pair = pred(item);
  while (pair && pair.length) {
    yield pair[0];
    pair = pred(pair[1]);
  }
});

// (T -> T) -> T -> Iterator<T>
const iterate = R.useWith(unfold, [
  pred => item => [item, pred(item)],
  R.identity,
]);

// todo: consider uniqueWith
// ((T, T) -> Boolean) -> Iterable<T> -> Iterator<T>
const uniqueBy = R.curry(function* uniqueBy(pred, iterable) {
  const arr = [];
  const add = item => arr.push(item);
  const has = item => arr.some((ai) => pred(item, ai));
  yield* filter((item) => {
    if (has(item)) return false;
    add(item);
    return true;
  }, iterable);
});

// Iterable<T> -> Iterator<T>
const unique = function* unique(iterable) {
  const set = new Set();
  yield* filter((item) => {
    if (set.has(item)) return;
    set.add(item);
    return true;
  }, iterable);
};

// Integer -> Iterable<T> -> Iterator<T>
const take = slice(0);

// Integer -> Iterable<T> -> Iterator<T>
const drop = R.curry((n, iterable) => slice(n, Infinity, iterable));

// T -> Iterator<T>
const repeat = iterate(R.identity);

// aka replicate
// Integer -> T -> Iterator<T>
const times = R.useWith(take, [R.identity, repeat]);

// Iterable<T> -> Integer
const length = reduce(R.add(1), 0);

// Iterable<Number> -> Number
const sum = reduce(R.add, 0);

// Iterable<Number> -> Number
const min = reduce(Math.min, Infinity);

// Iterable<Number> -> Number
const max = reduce(Math.max, -Infinity);

// Iterable<T> -> [T]
const toArray = reduce(R.flip(R.append), []);

// Integer -> Iterable<T> -> T
const nth = R.curry((n, iterable) => {
  for (const [i, item] of enumerate(iterable)) {
    if (i === n) return item;
  }
});

// todo: consider calling this any
// (T -> Boolean) -> Iterable<T> -> Boolean
const some = R.curry((pred, iterable) => {
  for (const item of iterable) if (pred(item)) return true;
  return false;
});

// (T -> Boolean) -> Iterable<T> -> Boolean
const none = R.complement(some);

// (T -> Boolean) -> Iterable<T> -> Boolean
const every = R.curry((pred, iterable) => {
  for (const item of iterable) if (!pred(item)) return false;
  return true;
});

// (T -> Boolean) -> Iterable<T> -> T | Undefined
const find = R.curry((pred, iterable) => {
  for (const item of iterable) if (pred(item)) return item;
});

// (T -> Boolean) -> Iterable<T> -> Integer | Undefined
const findIndex = R.curry((pred, iterable) => {
  for (const [i, item] of enumerate(iterable)) {
    if (pred(item)) return i;
  }
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
const includes = R.useWith(some, [strictEqual, R.identity]);

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

// Iterable<T> -> Iterator<[T]>
const group = groupWith(strictEqual);

// Integer -> Iterable<T> -> [Iterator<T>]
const tee = R.curry((n, iterable) => {
  const iterator = from(iterable);
  return [...Array(n)]
    .map(() => [])
    .map(function* gen(cache, _, caches) {
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

// Integer -> Iterable<T> -> [Iterator<T>, Iterator<T>]
const splitAt = R.curry((n, iterable) => {
  const [it1, it2] = tee(2, iterable);
  return [take(n, it1), drop(n, it2)];
});

// (T -> Boolean) -> Iterable<T> -> [Iterable<T>, Iterable<T>]
const partition = R.curry((pred, iterable) => {
  const [pass, fail] = tee(2, iterable);
  return [
    filter(pred, pass),
    filter(R.complement(pred), fail),
  ];
});

// Number -> Iterable<Iterable<T>> -> Iterator<T>
const flattenN = R.curry((n, iterable) => {
  if (n < 1) return iterable;
  return flatMap(function* fmap(item) {
    if (!isIterable(item)) return yield item;
    yield* flattenN(n - 1, item);
  }, iterable);
});

// Iterable<Iterable<T>> -> Iterator<T>
const unnest = flattenN(1);

// Iterable<Iterable<T>> -> Iterator<T>
const flatten = flattenN(Infinity);

const combinations = R.curry(function* combinations() {
  // todo
});

// Number -> Iterable<T> -> Iterator<[T]>
const permutations = R.curry(function* permutations(n, iterable) {

});

// Iterable<[A, B]> -> [Iterator<A>, Iterator<B>]
const unzip = R.pipe(
  tee(2),
  R.addIndex(R.map)((iter, i) => map(nth(i), iter)),
);

// T -> Iterable<T> -> Iterator<T>
const intersperse = R.curry(function* intersperse(spacer, iterable) {
  let first = true;
  for (const item of iterable) {
    if (!first) {
      yield spacer;
    } else {
      first = false;
    }
    yield item;
  }
});

// String -> Iterable<T> -> String
const join = pipeC(
  intersperse,
  reduce((left, right) => `${ left }${ right }`, '')
);

const isEmpty = some(R.always(true));

const unionWith = R.curry(() => {});
const union = unionWith(strictEqual);

const intersectWith = R.curry(() => {});
const intersect = intersectWith(strictEqual);

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
  findIndex,
  flatMap,
  flatten,
  flattenN,
  forEach,
  frame,
  from,
  group,
  groupWith,
  includes,
  indexOf,
  intersperse,
  isEmpty,
  iterate,
  join,
  length,
  map,
  max,
  min,
  next,
  none,
  nth,
  of,
  partition,
  permutations,
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
  sort,
  splitAt,
  splitEvery,
  StopIteration,
  sum,
  take,
  takeWhile,
  tee,
  times,
  toArray,
  unfold,
  unique,
  uniqueBy,
  unnest,
  unzip,
  zip,
  zipWith,
};
