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

/** Applies a function to each of an iterable's yielded items
  * @func
  * @sig (a → b) → Iterable<a> → Iterator<b>
  * @example
  * // Iterator<2, 4, 6>
  * map(n => n * 2, from([1, 2, 3]));
*/
export const map = R.curry(function* (f, xs) {
  for (const x of xs) yield f(x);
});

/** Returns an iterator from an iterable
  * @func
  * @sig Iterable<a> → Iterator<a>
  * @example
  * from([1, 2, 3]); // Iterator<1, 2, 3>
*/
export const from = map(R.identity);

/** Return the first or "next" item with a default value if iterable is empty
  * @func
  * @sig a → Iterable<a> → a
  * @example
  * nextOr(10, from([1, 2, 3])); // 1
  * nextOr(10, from([])); // 10
*/
export const nextOr = R.curry((or, iterator) => {
  iterator = from(iterator);
  const { value, done } = iterator.next();
  return done ? or : value;
});

/** Returns the first or "next" item. aka head
  * @func
  * @sig Iterable<a> → a
  * @example
  * next(from([1, 2, 3])); // 1
  * next(from([])); // StopIterationError()
*/
export const next = iterator => {
  iterator = from(iterator);
  const err = new StopIteration();
  const out = nextOr(err, iterator);
  if (out === err) throw err;
  return out;
};

/** Returns the last item
  * @func
  * @sig Iterable<a> → a
  * @example last(from(1, 2, 3)); // 3
*/
export const last = xs => {
  let last;
  for (const x of xs) last = x;
  return last;
};

/** Maps a function over an iterable and concatenates the results. a.k.a. "chain"
  * @func
  * @sig (a → Iterable<b>) → Iterable<a> → Iterator<b>
  * @example
  * const iterator = from([1, 2, 3]);
  *
  * // Iterator<1, 2, 2, 4, 3, 6>
  * flatMap(function* (n) {
  *   yield n;
  *   yield n * 2;
  * }, iterator);
*/
export const flatMap = R.curry(function* (f, xs) {
  for (const x of xs) yield* f(x);
});

/** Create an iterator of one or more (variadic) arguments
  * @func
  * @sig ...a → Iterator<a>
  * @example
  * of(1, 2, 3); // Iterator<1, 2, 3>
*/
export const of = R.unapply(from);

/** Scan
  * @func
  * @sig ((a, b) → a) → a → Iterable<b> → Iterator<a>
  * @example
  * // Iterator<1, 1, 2, 6, 24>
  * scan(R.multiply, 1, from([1, 2, 3, 4]));
*/
export const scan = R.curry(function* (f, acc, xs) {
  yield acc;
  yield* map(x => (acc = f(acc, x)), xs);
});

/** Reduce
  * @func
  * @sig ((a, b) → a) → a → Iterable<b> → a
  * @example
  * // 6
  * reduce((a, b) => a + b, 0, from([1, 2, 3]));
*/
export const reduce = pipeC(scan, last);

// ((...A) → B) → [Iterable<A>] → Iterator<B>
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
// [Iterable<A>] → Iterator<B>
export const zipAll = zipAllWith(Array.of);

export const zipWithN = n => R.curryN(n + 1)((f, ...iterables) => zipAllWith(f, iterables));

// ((A, B) → C) → Iterable<A> → Iterable<B> → Iterator<C>
export const zipWith = zipWithN(2);

/** Zips two iterables into pairs of items from corresponding indices
  * of the input iterables. truncated to shorter of two iterables
  * @func
  * @sig Iterable<a> → Iterable<b> → Iterator<[a, b]>
  * @example
  * // Iterator<[1, 4], [2, 5], [3, 6]>
  * zip(from([1, 2, 3]), from([4, 5, 6]));
*/
export const zip = zipWith(Array.of);

/** Iterates from 0 to n by with a step (exclusive)
  * @func
  * @sig Number → Number → Number → Iterator<Number>
  * @example
  * // Iterator<0, 15, 30, 45, 60, 75, 90>
  * rangeStep(15, 0, 100);
*/
export const rangeStep = R.curry(function* (step, start, stop) {
  if (step === 0) return;
  const cont = i => (step > 0 ? i < stop : i > stop);
  for (let i = start; cont(i); i += step) yield i;
});

/** Iterates from 0 to n - 1 (exclusive)
  * @func
  * @sig Number → Number → Iterator<Number>
  * @example
  * range(0, 5); // Iterator<0, 1, 2, 3, 4>
*/
export const range = rangeStep(1);

/** Transform an iterable to an iterable of pairs of indices and their items
  * @func
  * @sig Iterable<a> → Iterator<[Integer, a]>
  * @example
  * // Iterator<[0, 'zero'], [1, 'one'], [2, 'two']>
  * enumerate(from(['zero', 'one', 'two']));
*/
export const enumerate = iterable => zip(range(0, Infinity), iterable);

// accumulate is to scan, like reduce with no init
// todo: consider ditching this. scan is more useful
// ((A, T) → A) → Iterable<T> → Iterator<A>
export const accumulate = R.curry((f, xs) => {
  let last;
  return map(([i, x]) => {
    return (last = i ? f(last, x) : x);
  }, enumerate(xs));
});

/** Slice an iterator between two indices
  * @func
  * @sig Integer → Integer → Iterable<a> → Iterator<a>
  * @example
  * // Iterator<3, 4, 5>
  * slice(2, 5, from([1, 2, 3, 4, 5, 6, 7, 8]));
*/
export const slice = R.curry(function* (start, stop, xs) {
  for (const [i, x] of enumerate(xs)) {
    if (i >= start) yield x;
    if (i >= stop - 1) return;
  }
});

/** Yield all items from one iterator, then the other
  * @func
  * @sig Iterable<a> → Iterable<a> → Iterator<a>
  * @example
  * // Iterator<1, 2, 3, 4, 5, 6>
  * concat(from([1, 2, 3]), from([4, 5, 6]));
*/
export const concat = R.curry(function* (xs1, xs2) {
  yield* xs1;
  yield* xs2;
});

/** Prepend an item `a` to the end of an iterable
  * @func
  * @sig a → Iterable<a> → Iterator<a>
  * @example
  * // Iterator<0, 1, 2, 3>
  * prepend(0, from([1, 2, 3]));
*/
export const prepend = R.useWith(concat, [of, R.identity]);

/** Append an item `a` to the start of an iterable
  * @func
  * @sig a → Iterable<a> → Iterator<a>
  * // Iterator<1, 2, 3, 4>
  * @example append(4, from([1, 2, 3]));
*/
export const append = R.useWith(R.flip(concat), [of, R.identity]);

/** Run a function (side-effect) once for each item
  * @func
  * @sig (a → b) → Iterable<a> → Iterator<a>
*/
export const forEach = R.curry(function* (f, xs) {
  // eslint-disable-next-line no-unused-expressions
  for (const x of xs) f(x), yield x;
});

/** Yield only items that pass the predicate
  * @func
  * @sig (a → Boolean) → Iterable<a> → Iterator<a>
  * @example
  * // Iterator<1, 2, 3, 4>
  * filter(n => (n < 5), from([1, 2, 3, 4, 5, 6, 7, 8]));
*/
export const filter = R.curry(function* (f, xs) {
  for (const x of xs) if (f(x)) yield x;
});

/** Yield only items that do not pass the predicate
  * @func
  * @sig (a → Boolean) → Iterable<a> → Iterator<a>
  * @example
  * // Iterator<6, 7, 8>
  * reject(n => (n < 5), from(1, 2, 3, 4, 5, 6, 7, 8));
*/
export const reject = R.useWith(filter, [R.complement, R.identity]);

/** Flattens n-levels of a nested iterable of iterables
  * @func
  * @sig Number → Iterable<Iterable<a>> → Iterator<a>
  * @example
  * // Iterator<1, 2, 3, [4]>
  * flattenN(2, from([1, [2, [3, [4]]]]))
*/
export const flattenN = R.curry((n, xs) => {
  if (n < 1) return xs;
  return flatMap(function* (x) {
    if (!isIterable(x)) return yield x;
    yield* flattenN(n - 1, x);
  }, xs);
});

/** Flattens one level of a nested iterable of iterables
  * @func
  * @sig Iterable<Iterable<a>> → Iterator<a>
  * @example
  * // Iterator<1, 2, [3, [4]]>
  * unnest(from([1, [2, [3, [4]]]]));
*/
export const unnest = flattenN(1);

/** Flattens a nested iterable of iterables into a single iterable
  * @func
  * @sig Iterable<Iterable<a>> → Iterator<a>
  * @example
  * // Iterator<1, 2, 3, 4>
  * unnest(from([1, [2, [3, [4]]]]));
*/
export const flatten = flattenN(Infinity);

/** Unfold
  * @func
  * @sig (a → [a, a]) → a → Iterator<a>
  * @example
  * // Iterator<1, 2, 4, 8>
  * unfold(n => (n < 10 ? [n, n * 2] : false), 1);
*/
export const unfold = R.curry(function* (f, x) {
  let pair = f(x);
  while (pair && pair.length) {
    yield pair[0];
    pair = f(pair[1]);
  }
});

// (A → [Iterable<B>, A]) → * → Iterator<B>
export const flatUnfold = pipeC(unfold, unnest);

/** Flat iterate
  * @func
  * @sig (a → Iterable<a>) → a → Iterator<a>
  * @example
  * // Iterator<0, 0, 1, 2, 2, 4, 3, 6, 4, 8, ...>
  * flatIterate(function* (n) {
  *   yield n;
  *   yield (n * 2);
  *   return n + 1;
  * }, 0));
*/
export const flatIterate = R.curry(function* flatIterate(f, x) {
  while (true) x = yield* f(x);
});

/** Iterate infinitely, yielding items from seed through a predicate
  * @func
  * @sig (a → a) → a → Iterator<a>
  * @example
  * // Iterator<0, 2, 4, 6, 8, 10, ...>
  * iterate(n => n + 2, 0);
*/
export const iterate = R.useWith(unfold, [
  f => x => [x, f(x)],
  R.identity,
]);

// yield only items that are unique by their predicate
// ((T, T) → Boolean) → Iterable<T> → Iterator<T>
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
// Iterable<T> → Iterator<T>
export const unique = function* (xs) {
  const set = new Set();
  yield* filter(x => {
    if (set.has(x)) return;
    set.add(x);
    return true;
  }, xs);
};

/** Yield only the first n items of an iterable
  * @func
  * @sig Integer → Iterable<a> → Iterator<a>
  * @example
  * // Iterator<1, 2, 3>
  * take(3, from(1, 2, 3, 4, 5));
*/
export const take = R.curry(function* (n, xs) {
  if (n <= 0) return;
  yield* slice(0, n, xs);
});

/** Drop the first n items of an iterable
  * @func
  * @sig Integer → Iterable<a> → Iterator<a>
  * @example
  * // Iterator<4, 5>
  * drop(3, from(1, 2, 3, 4, 5));
*/
export const drop = R.curry((n, iterable) => slice(n, Infinity, iterable));

/** Yield all but the first item
  * @func
  * @sig Iterable<a> → Iterator<a>
  * @example
  * // Iterator<2, 3, 4, 5>
  * tail(from(1, 2, 3, 4, 5));
*/
export const tail = drop(1);

/** Infinitely yield an item (a)
  * @func
  * @sig a → Iterator<a>
  * @example
  * // Iterator<'hi', 'hi', 'hi', ...>
  * repeat('hi');
*/
export const repeat = iterate(R.identity);

/** Yield an item (a) n times. aka replicate
  * @func
  * @sig Integer → a → Iterator<a>
  * @example
  * // Iterator<'hi', 'hi', 'hi', 'hi'>
  * times(4, 'hi');
*/
export const times = R.useWith(take, [R.identity, repeat]);

/** Get length of iterable
  * @func
  * @sig Iterable<a> → Integer
  * @example
  * // 5
  * length(from([1, 2, 3, 4, 5]));
*/
export const length = reduce(R.add(1), 0);

/** Return the number of items in an iterable. exhasts input
  * @func
  * @async
  * @sig (a → Boolean) → Iterable<a> → Integer
  * @example
  * // 4
  * count(n => (n > 3), from([1, 2, 3, 4, 5, 6, 7]));
*/
export const count = pipeC(filter, length);

/** Sum by
  * @func
  * @sig (a → Number) → Iterable<a> → Number
*/
export const sumBy = pipeC(map, reduce(R.add, 0));

/** Min by
  * @func
  * @sig (a → Number) → Iterable<a> → Number
*/
export const minBy = pipeC(map, reduce(Math.min, Infinity));

/** Max by
  * @func
  * @sig (a → Number) → Iterable<a> → Number
*/
export const maxBy = pipeC(map, reduce(Math.max, -Infinity));

/** Sum
  * @func
  * @sig Iterable<Number> → Number
  * @example sum(from([1, 2, 3])); // 6
*/
export const sum = sumBy(R.identity);

/** Min
  * @func
  * @sig Iterable<Number> → Number
  * @example min(from([1, 2, 3])); // 1
*/
export const min = minBy(R.identity);

/** Max
  * @func
  * @sig Iterable<Number> → Number
  * @example max(from([1, 2, 3])); // 3
*/
export const max = maxBy(R.identity);

/** Transforms an iterable to an array. exhasts input
  * @func
  * @sig Iterable<a> → [a]
  * @example toArray(from([1, 2, 3])); // [1, 2, 3]
*/
export const toArray = reduce(R.flip(R.append), []);

/** Returns the element at the nth index
  * @func
  * @sig Integer → Iterable<a> → a|undefined
  * // 'b'
  * nth(1, from(['a', 'b', 'c', 'd']));
*/
export const nth = R.curry((n, xs) => {
  for (const [i, x] of enumerate(xs)) {
    if (i === n) return x;
  }
});

// todo: consider calling this any
// does any item pass its predicate?
// (T → Boolean) → Iterable<T> → Boolean
export const some = R.curry((f, xs) => {
  for (const x of xs) if (f(x)) return true;
  return false;
});

// do all items fail their predicate?
// (T → Boolean) → Iterable<T> → Boolean
export const none = R.complement(some);

/** Do all items pass their predicate?
  * @func
  * @sig (a → Boolean) → Iterable<a> → Boolean
  * @example
  * // false
  * every(n => (n < 4), from([1, 2, 3, 4]));
*/
export const every = R.curry((f, xs) => {
  for (const x of xs) if (!f(x)) return false;
  return true;
});

/** Find
  * @func
  * @sig (a → Boolean) → Iterable<a> → a|undefined
  * @example
  * const records = [{ id: 1 }, { id: 2 }, { id: 3 }];
  * // { id: 2 }
  * find(record => (record.id === 2), records);
*/
export const find = R.curry((f, xs) => {
  for (const x of xs) if (f(x)) return x;
});

/** Find index
  * @func
  * @async
  * @sig (a → Boolean) → Iterable<a> → Integer
  * @example
  * const records = [{ id: 1 }, { id: 2 }, { id: 3 }];
  * // 1
  * find(record => (record.id === 2), records);
*/
export const findIndex = R.curry((f, xs) => {
  for (const [i, x] of enumerate(xs)) {
    if (f(x)) return i;
  }
  return -1;
});

/** Yield all items
  * @func
  * @todo should return inputs
  * @sig Iterable<a> → undefined
  * @example
  * const iterator = from([1, 2, 3]);
  * exhaust(iterator);
  * toArray(iterator); // []
*/
export const exhaust = xs => {
  for (const _ of xs);
};

// (T → Boolean) → Iterable<T> → Iterator<T>
export const takeWhile = R.curry(function* (f, xs) {
  for (const x of xs) {
    if (!f(x)) return;
    yield x;
  }
});

// (T → Boolean) → Iterable<T> → Iterator<T>
export const dropWhile = R.curry(function* (f, xs) {
  xs = from(xs);
  for (const x of xs) {
    if (!f(x)) return yield* prepend(x, xs);
  }
});

/** Reverse
  * @func
  * @todo: there might be a more efficient strategy for arrays. generators are not iterable in reverse
  * @sig Iterable<a> → Iterator<a>
  * @example reverse(from([1, 2, 3])); // Iterator<3, 2, 1>
*/
export const reverse = R.pipe(toArray, R.reverse);

/** Sort
  * @func
  * @sig ((a, a) → Number) → Iterable<a> → Iterator<a>
*/
export const sort = R.useWith(R.sort, [R.identity, toArray]);

/** Yield a sliding "window" of length n. note: caches n items
  * @func
  * @sig Integer → Iterable<a> → Iterator<[a]>
  * @example
  * // Iterator<[0, 1, 2], [1, 2, 3], [2, 3, 4], [4, 5, 6]>
  * frame(3, from([0, 1, 2, 3, 4, 5, 6]));
*/
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

/** Yield all but the last n items. note: caches n + 1 items
  * @func
  * @sig Number → Iterable<a> → Iterator<a>
  * @example
  * // Iterator<1, 2, 3>
  * dropLast(2, from([1, 2, 3, 4, 5]));
*/
export const dropLast = R.curry(function* (n, xs) {
  const done = new StopIteration();
  for (const group of frame(n + 1, append(done, xs))) {
    if (R.last(group) === done) return;
    yield R.head(group);
  }
});

/** Yield all but the last 1 item
  * @func
  * @sig Iterable<a> → Iterator<a>
  * @example
  * // Iterator<1, 2, 3, 4>
  * init(from([1, 2, 3, 4, 5]));
*/
export const init = dropLast(1);

// T → Iterable<T> → Integer
export const indexOf = R.useWith(findIndex, [is, R.identity]);

// * → Iterable<T> → Boolean
export const includes = R.useWith(some, [is, R.identity]);

// yield groups of items where the predicate returns truthy
// for all adjacent items
// ((T , T) → Boolean) → Iterable<T> → Iterator<[T]>
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

// Iterable<T> → Iterator<[T]>
export const group = groupWith(is);

/** Copy an iterator n times (exhausts its input)
  * @func
  * @sig Integer → Iterable<a> → [Iterator<a>]
  * @example
  * // [Iterator<1, 2, 3>, Iterator<1, 2, 3>, Iterator<1, 2, 3>]
  * tee(3, from([1, 2, 3]));
*/
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

/** Yield groups of length n
  * @func
  * @sig Integer → Iterable<a> → Iterator<[a]>
  * @example
  * // Iterator<[0, 1, 2], [3, 4, 5], [6, 7, 8]>
  * splitEvery(3, from([0, 1, 2, 3, 4, 5, 6, 7, 8]));
*/
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

/** Split an iterable into a pair of iterables at a particular index
  * @func
  * @sig Integer → Iterable<a> → [Iterator<a>, Iterator<a>]
  * @example
  * // [Iterator<0, 1, 2, 3, 4>, Iterator<5, 6>]
  * splitAt(4, from([0, 1, 2, 3, 4, 5, 6]));
*/
export const splitAt = R.curry((n, xs) => {
  const [it1, it2] = tee(2, xs);
  return [take(n, it1), drop(n, it2)];
});

/** Split an iterable into a pair of iterables based on the truthiness of their predicate
  * @func
  * @sig (a → Boolean) → Iterable<a> → [Iterator<a>, Iterator<a>]
  * @example
  * // [Iterator<0, 1, 2>, Iterator<3, 4, 5, 6>]
  * partition(n => n < 3, from([0, 1, 2, 3, 4, 5, 6]));
*/
export const partition = R.curry((f, xs) => {
  const [pass, fail] = tee(2, xs);
  return [filter(f, pass), reject(f, fail)];
});

/** Yield all items from an iterator, n times
  * @func
  * @sig Integer → Iterable<a> → Iterator<a>
  * @example
  * // Iterator<1, 2, 1, 2, 1, 2>
  * cycleN(3, from([1, 2]));
*/
export const cycleN = R.curry(function* (n, xs) {
  if (n < 1) return;
  const buffer = [];
  yield* forEach(x => buffer.push(x), xs);
  while (n-- > 1) yield* buffer;
});

/** Yield iterable items cyclically, infinitely looping when exhausted
  * @func
  * @sig Iterable<a> → Iterator<a>
  * @example
  * // Iterator<1, 2, 3, 1, 2, 3, ...>
  * cycle(from([1, 2, 3]));
*/
export const cycle = cycleN(Infinity);

// transforms an iterable of n-tuple into an n-tuple of iterables
// Number → Iterable<[A, B, ...Z]> → [Iterator<A>, Iterator<B>, ...Iterator<Z>]
export const unzipN = pipeC(tee, R.addIndex(R.map)((xs, i) => map(nth(i), xs)));

// transforms an iterable of pairs into a pairs of iterables
// Iterable<[A, B]> → [Iterator<A>, Iterator<B>]
export const unzip = unzipN(2);

/** Insert an item `a` between every item in the iterable
  * @func
  * @sig a → Iterable<a> → Iterator<a>
  * @example
  * // Iterator<'a', '-', 'b', '-', 'c'>
  * intersperse('-', from('a', 'b', 'c'));
*/
export const intersperse = R.useWith(flatMap, [
  spacer => ([i, x]) => (i ? [spacer, x] : [x]),
  enumerate,
]);

/** Serialize iterator items to a string with an arbitrary spacer
  * @todo consider taking a function instead of a string
  * @func
  * @sig String → Iterable<a> → String
  * @example
  * // 'some-slug-parts';
  * joinWith('-', from(['some', 'slug', 'parts']));
*/
export const joinWith = pipeC(
  intersperse,
  reduce(R.unapply(R.join('')), ''),
);

/** Serialize iterator items to a string
  * @func
  * @sig Iterable<a> → String
  * @example
  * // 'abcde'
  * join(from(['a', 'b', 'c', 'd', 'e']));
*/
export const join = joinWith('');

/** Is an iterable empty? (done or length = 0)
  * @func
  * @sig Iterable<a> → Boolean
  * @example
  * isEmpty(from([])); // true
  * isEmpty(from([1])); // false
*/
export const isEmpty = none(_ => true);

// ((T, T) → Boolean) → Iterable<T> → Iterable<T> → Boolean
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

// Iterable<T> → Iterable<T> → Boolean
export const corresponds = correspondsWith(is);

/** Get an iterator of indices (0 to length - 1)
  * @func
  * @sig Iterable<a> → Iterator<Integer>
  * @example
  * // Iterator<0, 1, 2>
  * indices(from(['a', 'b', 'c']));
*/
export const indices = R.pipe(enumerate, map(R.head));

/** Pad an iterable with with a finite number of items `a`
  * @func
  * @sig Integer → a → Iterable<a> → Iterator<a>
  * @example
  * // Iterator<'a', 'b', 'c', 'd', 'd', 'd'>
  * padTo(6, 'd', from(['a', 'b', 'c']));
*/
export const padTo = R.curry(function* (len, padder, xs) {
  let n = 0;
  yield* forEach((item) => n++, xs);
  if (n < len) yield* times(len - n, padder);
});

/** Pad iterable with an infinite number of items `a`
  * @func
  * @sig a → Iterable<a> → Iterator<a>
  * @example
  * // Iterator<'a', 'b', 'c', 'd', 'd', 'd', ...>
  * pad('d', from(['a', 'b', 'c']));
*/
export const pad = padTo(Infinity);

// const unionWith = R.curry(() => {});
// const union = unionWith(is);

// const intersectWith = R.curry(() => {});
// const intersect = intersectWith(is);

// const combinations = R.curry(function* combinations() {});
// const permutations = R.curry(function* permutations(n, iterable) {});

// (T → *) → Iterable<T> → Undefined
// const subscribe = pipeC(forEach, exhaust);
