/* eslint-disable func-names */

// modules
import * as R from 'ramda';

// aliased
import { pipeC } from 'funk-lib/function';
import { is, isIterable } from 'funk-lib/is';

// local
import StopIteration from './stop-iteration';

export { yieldWith } from './yield-with';

// todo: consider replacing "is" with R.equals

// (A -> B) -> Iterable<A> -> Iterator<B>
export const map = R.curry(function* (f, xs) {
  for (const x of xs) yield f(x);
});

/** Returns an iterator from an iterable
  * @func
  * @sig Iterable<a> -> Iterator<a>
  * @example
  * from([1, 2, 3]) // Iterator<1, 2, 3>
*/
export const from = map(R.identity);

// * -> Iterable<T> -> T | *
export const nextOr = R.curry((or, iterator) => {
  iterator = from(iterator);
  const { value, done } = iterator.next();
  return done ? or : value;
});

// returns the first or "next" item. aka head
// Iterable<T> -> T
export const next = iterator => {
  iterator = from(iterator);
  const err = new StopIteration();
  const out = nextOr(err, iterator);
  if (out === err) throw err;
  return out;
};

// returns the last item
// Iterable<T> -> T
export const last = xs => {
  let last;
  for (const x of xs) last = x;
  return last;
};

// (A -> Iterable<B>) -> Iterable<A> -> Iterator<B>
export const flatMap = R.curry(function* (f, xs) {
  for (const x of xs) yield* f(x);
});

// create an iterator of one or more (variadic) arguments
// T... -> Iterator<T>
export const of = R.unapply(from);

// ((A, T) -> A) -> A -> Iterable<T> -> Iterator<A>
export const scan = R.curry(function* (f, acc, xs) {
  yield acc;
  yield* map(x => (acc = f(acc, x)), xs);
});

// ((A, T) -> A) -> A -> Iterable<T> -> A
export const reduce = pipeC(scan, last);

// ((...A) -> B) -> [Iterable<A>] -> Iterator<B>
export const zipAllWith = R.curry(function* (func, iterators) {
  iterators = R.map(from, iterators);
  while (true) {
    const { done, values } = R.reduce((out, iterator) => {
      if (out.done) return R.reduced(out);
      const { value, done } = iterator.next();
      return R.evolve({
        values: R.append(value),
        done: R.or(done),
      }, out);
    }, { done: false, values: [] }, iterators);
    if (done) return;
    yield func(...values);
  }
});

// zip an array of iterables into an iterables of arrays of items from corresponding indices
// of the input iterables
// [Iterable<A>] -> Iterator<B>
export const zipAll = zipAllWith(Array.of);

export const zipWithN = n => R.curryN(n + 1)((f, ...iterables) => zipAllWith(f, iterables));

// ((A, B) -> C) -> Iterable<A> -> Iterable<B> -> Iterator<C>
export const zipWith = zipWithN(2);

// "zips" two iterables into pairs of items from corresponding indices
// of the input iterables. truncated to shorter of two iterables
// Iterable<A> -> Iterable<B> -> Iterator<[A, B]>
export const zip = zipWith(Array.of);

// iterates from 0 to n by with a step (exclusive)
// Number -> Number -> Number -> Iterator<Number>
export const rangeStep = R.curry(function* (step, start, stop) {
  if (step === 0) return;
  const cont = i => (step > 0 ? i < stop : i > stop);
  for (let i = start; cont(i); i += step) yield i;
});

// iterates from 0 to n - 1 (exclusive)
// Number -> Number -> Iterator<Number>
export const range = rangeStep(1);

// transform an iterable to an iterable of pairs of indices and their items
// Iterable<T> -> Iterator<[Integer, T]>
export const enumerate = iterable => zip(range(0, Infinity), iterable);

// accumulate is to scan, like reduce with no init
// todo: consider ditching this. scan is more useful
// ((A, T) -> A) -> Iterable<T> -> Iterator<A>
export const accumulate = R.curry((f, xs) => {
  let last;
  return map(([i, x]) => {
    return (last = i ? f(last, x) : x);
  }, enumerate(xs));
});

// Integer -> Integer -> Iterable<T> -> Iterator<T>
export const slice = R.curry(function* (start, stop, xs) {
  for (const [i, x] of enumerate(xs)) {
    if (i >= start) yield x;
    if (i >= stop - 1) return;
  }
});

// yield all items from one iterator, then the other
// Iterable<T> -> Iterable<T> -> Iterator<T>
export const concat = R.curry(function* (xs1, xs2) {
  yield* xs1;
  yield* xs2;
});

// prepend an item (T) to the end of an iterable
// T -> Iterable<T> -> Iterator<T>
export const prepend = R.useWith(concat, [of, R.identity]);

// append an item (T) to the start of an iterable
// T -> Iterable<T> -> Iterator<T>
export const append = R.useWith(R.flip(concat), [of, R.identity]);

// run a function (side-effect) once for each item
// (T -> *) -> Iterable<T> -> Iterator<T>
export const forEach = R.curry(function* (f, xs) {
  // eslint-disable-next-line no-unused-expressions
  for (const x of xs) f(x), yield x;
});

// yield only items that pass the predicate
// (T -> Boolean) -> Iterable<T> -> Iterator<T>
export const filter = R.curry(function* (f, xs) {
  for (const x of xs) if (f(x)) yield x;
});

// yield only items that do not pass the predicate
// (T -> Boolean) -> Iterable<T> -> Iterator<T>
export const reject = R.useWith(filter, [R.complement, R.identity]);

// flattens n-levels of a nested iterable of iterables
// Number -> Iterable<Iterable<T>> -> Iterator<T>
export const flattenN = R.curry((n, xs) => {
  if (n < 1) return xs;
  return flatMap(function* (x) {
    if (!isIterable(x)) return yield x;
    yield* flattenN(n - 1, x);
  }, xs);
});

// flattens one level of a nested iterable of iterables
// Iterable<Iterable<T>> -> Iterator<T>
export const unnest = flattenN(1);

// flattens a nested iterable of iterables into a single iterable
// Iterable<Iterable<T>> -> Iterator<T>
export const flatten = flattenN(Infinity);

// (A -> [B]) -> * -> Iterator<B>
export const unfold = R.curry(function* (f, x) {
  let pair = f(x);
  while (pair && pair.length) {
    yield pair[0];
    pair = f(pair[1]);
  }
});

// (A -> [Iterable<B>, A]) -> * -> Iterator<B>
export const flatUnfold = pipeC(unfold, unnest);

// (T -> Iterable<A>) -> T -> Iterator<A>
export const flatIterate = R.curry(function* flatIterate(f, x) {
  while (true) x = yield* f(x);
});

// iterate infinitely, yielding items from seed through a predicate
// (T -> T) -> T -> Iterator<T>
export const iterate = R.useWith(unfold, [
  f => x => [x, f(x)],
  R.identity,
]);

// yield only items that are unique by their predicate
// ((T, T) -> Boolean) -> Iterable<T> -> Iterator<T>
export const uniqueWith = R.curry(function* (f, xs) {
  const seen = [];
  const add = saw => seen.push(saw);
  const has = item => seen.some(saw => f(item, saw));
  yield* filter(item => {
    if (has(item)) return false;
    add(item);
    return true;
  }, xs);
});

// yield only the unique items in an iterable (using Set)
// Iterable<T> -> Iterator<T>
export const unique = function* (xs) {
  const set = new Set();
  yield* filter(x => {
    if (set.has(x)) return;
    set.add(x);
    return true;
  }, xs);
};

// yield only the first n items of an iterable
// Integer -> Iterable<T> -> Iterator<T>
export const take = R.curry(function* (n, xs) {
  if (n <= 0) return;
  yield* slice(0, n, xs);
});

// drop the first n items of an iterable
// Integer -> Iterable<T> -> Iterator<T>
export const drop = R.curry((n, iterable) => slice(n, Infinity, iterable));

// yield all but the first item
// Iterable<T> -> Iterator<T>
export const tail = drop(1);

// infinitely yield an item (T)
// T -> Iterator<T>
export const repeat = iterate(R.identity);

// yield an item (T) n times
// aka replicate
// Integer -> T -> Iterator<T>
export const times = R.useWith(take, [R.identity, repeat]);

// Iterable<T> -> Integer
export const length = reduce(R.add(1), 0);

// return the number of items in an iterable. exhasts input
// (T -> Boolean) -> Iterable<T> -> Integer
export const count = pipeC(filter, length);

// (T -> Number) -> Iterable<T> -> Number
export const sumBy = pipeC(map, reduce(R.add, 0));

// (T -> Number) -> Iterable<T> -> Number
export const minBy = pipeC(map, reduce(Math.min, Infinity));

// (T -> Number) -> Iterable<T> -> Number
export const maxBy = pipeC(map, reduce(Math.max, -Infinity));

// Iterable<Number> -> Number
export const sum = sumBy(R.identity);

// Iterable<Number> -> Number
export const min = minBy(R.identity);

// Iterable<Number> -> Number
export const max = maxBy(R.identity);

// transforms an iterable to an array. exhasts input
// Iterable<T> -> [T]
export const toArray = reduce(R.flip(R.append), []);

// returns the item at the nth index
// Integer -> Iterable<T> -> T | Undefined
export const nth = R.curry((n, xs) => {
  for (const [i, x] of enumerate(xs)) {
    if (i === n) return x;
  }
});

// todo: consider calling this any
// does any item pass its predicate?
// (T -> Boolean) -> Iterable<T> -> Boolean
export const some = R.curry((f, xs) => {
  for (const x of xs) if (f(x)) return true;
  return false;
});

// do all items fail their predicate?
// (T -> Boolean) -> Iterable<T> -> Boolean
export const none = R.complement(some);

// do all items pass their predicate?
// (T -> Boolean) -> Iterable<T> -> Boolean
export const every = R.curry((f, xs) => {
  for (const x of xs) if (!f(x)) return false;
  return true;
});

// (T -> Boolean) -> Iterable<T> -> T | Undefined
export const find = R.curry((f, xs) => {
  for (const x of xs) if (f(x)) return x;
});

// (T -> Boolean) -> Iterable<T> -> Integer
export const findIndex = R.curry((f, xs) => {
  for (const [i, x] of enumerate(xs)) {
    if (f(x)) return i;
  }
  return -1;
});

// yield all items
// Iterable<T> -> Undefined
export const exhaust = xs => {
  for (const _ of xs);
};

// (T -> Boolean) -> Iterable<T> -> Iterator<T>
export const takeWhile = R.curry(function* (f, xs) {
  for (const x of xs) {
    if (!f(x)) return;
    yield x;
  }
});

// (T -> Boolean) -> Iterable<T> -> Iterator<T>
export const dropWhile = R.curry(function* (f, xs) {
  xs = from(xs);
  for (const x of xs) {
    if (!f(x)) return yield* prepend(x, xs);
  }
});

// todo: there might be a more efficient strategy for arrays
// generators are not iterable in reverse
// Iterable<T> -> Iterator<T>
export const reverse = R.pipe(toArray, R.reverse);

// ((T, T) -> Number) -> Iterable<T> -> Iterator<T>
export const sort = R.useWith(R.sort, [R.identity, toArray]);

// yield a sliding "window" of length n
// note: caches of n items
// Integer -> Iterable<T> -> Iterator<[T]>
export const frame = R.curry(function* (n, xs) {
  const cache = [];
  yield* flatMap(function* (x) {
    if (cache.length === n) {
      yield [...cache];
      cache.shift();
    }
    cache.push(x);
  }, xs);
  yield cache;
});

// yield all but the last n items
// note: caches n + 1 items
// Number -> Iterable<T> -> Iterator<T>
export const dropLast = R.curry(function* (n, xs) {
  const done = new StopIteration();
  for (const group of frame(n + 1, append(done, xs))) {
    if (R.last(group) === done) return;
    yield R.head(group);
  }
});

// yield all but the last 1 item
// Iterable<T> -> Iterator<T>
export const init = dropLast(1);

// T -> Iterable<T> -> Integer
export const indexOf = R.useWith(findIndex, [is, R.identity]);

// * -> Iterable<T> -> Boolean
export const includes = R.useWith(some, [is, R.identity]);

// yield groups of items where the predicate returns truthy
// for all adjacent items
// ((T , T) -> Boolean) -> Iterable<T> -> Iterator<[T]>
export const groupWith = R.curry(function* (f, xs) {
  let last, group = [];
  yield* flatMap(function* ([i, x]) {
    if (i && !f(last, x)) {
      yield group;
      group = [];
    }
    group.push(last = x);
  }, enumerate(xs));
  if (group.length) yield group;
});

// Iterable<T> -> Iterator<[T]>
export const group = groupWith(is);

// copy an iterator n times (exhausts its input)
// Integer -> Iterable<T> -> [Iterator<T>]
export const tee = R.curry((n, xs) => {
  xs = from(xs);
  return [...Array(n)]
    .map(() => [])
    .map(function* (cache, _, caches) {
      while (true) {
        if (!cache.length) {
          const { done, value } = xs.next();
          if (done) return;
          for (const cache of caches) cache.push(value);
        }
        yield cache.shift();
      }
    });
});

// yield groups of length n
// Integer -> Iterable<T> -> Iterator<[T]>
export const splitEvery = R.curry(function* (n, xs) {
  let group = [];
  yield* flatMap(function* (x) {
    group.push(x);
    if (group.length < n) return;
    yield group;
    group = [];
  }, xs);
  if (group.length) yield group;
});

// split an iterable into a pair of iterables at a particular index
// Integer -> Iterable<T> -> [Iterator<T>, Iterator<T>]
export const splitAt = R.curry((n, xs) => {
  const [it1, it2] = tee(2, xs);
  return [take(n, it1), drop(n, it2)];
});

// split an iterable into a pair of iterables based on the truthiness of their predicate
// (T -> Boolean) -> Iterable<T> -> [Iterator<T>, Iterator<T>]
export const partition = R.curry((f, xs) => {
  const [pass, fail] = tee(2, xs);
  return [filter(f, pass), reject(f, fail)];
});

// yield all items from an iterator, n times
// Integer -> Iterable<T> -> Iterator<T>
export const cycleN = R.curry(function* (n, xs) {
  if (n < 1) return;
  const buffer = [];
  yield* forEach(x => buffer.push(x), xs);
  while (n-- > 1) yield* buffer;
});

// yield iterable items cyclically, infinitely looping when exhausted
// Iterable<T> -> Iterator<T>
export const cycle = cycleN(Infinity);

// transforms an iterable of n-tuple into an n-tuple of iterables
// Number -> Iterable<[A, B, ...Z]> -> [Iterator<A>, Iterator<B>, ...Iterator<Z>]
export const unzipN = pipeC(tee, R.addIndex(R.map)((xs, i) => map(nth(i), xs)));

// transforms an iterable of pairs into a pairs of iterables
// Iterable<[A, B]> -> [Iterator<A>, Iterator<B>]
export const unzip = unzipN(2);

// insert an item (T) between every item in the iterable
// T -> Iterable<T> -> Iterator<T>
export const intersperse = R.useWith(flatMap, [
  spacer => ([i, x]) => (i ? [spacer, x] : [x]),
  enumerate,
]);

// serialize iterator items to a string with an arbitrary spacer
// String -> Iterable<T> -> String
export const joinWith = pipeC(
  intersperse,
  reduce(R.unapply(R.join('')), ''),
);

// serialize iterator items to a string
// Iterable<T> -> String
export const join = joinWith('');

// is an iterable empty? (done or length = 0)
// Iterable<T> -> Boolean
export const isEmpty = none(_ => true);

// ((T, T) -> Boolean) -> Iterable<T> -> Iterable<T> -> Boolean
export const correspondsWith = R.useWith((pred, iterator1, iterator2) => {
  let done;
  do {
    const { done: done1, value: value1 } = iterator1.next();
    const { done: done2, value: value2 } = iterator2.next();
    if (done1 !== done2) return false;
    done = (done1 && done2);
    if (!done && !pred(value1, value2)) return false;
  } while (!done);
  return true;
}, [R.identity, from, from]);

// Iterable<T> -> Iterable<T> -> Boolean
export const corresponds = correspondsWith(is);

// get an iterator of indices (0 to length - 1)
// Iterable<T> -> Iterator<Integer>
export const indices = R.pipe(enumerate, map(R.head));

// pad an iterable with with a finite number of items (T)
// Integer -> T -> Iterable<T> -> Iterator<T>
export const padTo = R.curry(function* (len, padder, xs) {
  let n = 0;
  yield* forEach((item) => n++, xs);
  if (n < len) yield* times(len - n, padder);
});

// pad iterable with an infinite number of items (T)
// T -> Iterable<T> -> Iterator<T>
export const pad = padTo(Infinity);

// const unionWith = R.curry(() => {});
// const union = unionWith(is);

// const intersectWith = R.curry(() => {});
// const intersect = intersectWith(is);

// const combinations = R.curry(function* combinations() {});
// const permutations = R.curry(function* permutations(n, iterable) {});

// (T -> *) -> Iterable<T> -> Undefined
// const subscribe = pipeC(forEach, exhaust);
