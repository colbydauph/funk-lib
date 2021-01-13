/* eslint-disable func-names */

// modules
import * as R from 'ramda';

// aliased
import { pipeC } from 'funk-lib/function';
import { pipeC as asyncPipeC, reduce as reduceP } from 'funk-lib/async';
import { is, isIterable, isAsyncIterable } from 'funk-lib/is';

// local
import StopIteration from './stop-iteration';

// fixme: polyfill Symbol.asyncIterator
// https://github.com/babel/babel/issues/8450
// https://github.com/babel/babel/issues/7467
import 'core-js/modules/es.symbol.async-iterator';

export { yieldWithAsync as yieldWith } from './yield-with';

const complementP = f => R.curryN(f.length)(async (...args) => !await f(...args));

// todo: consider replacing "is" with R.equals

/** Apply a function to each yielded item
  * @func
  * @sig (a → Promise b) → Iterable a → AsyncIterator b
  * @example
  * // AsyncIterator(2, 4, 6)
  * map(async n => n * 2, from([1, 2, 3]));
*/
export const map = R.curry(async function* (f, xs) {
  for await (const x of xs) yield await f(x);
});

/** Transforms any iterable into an async iterator
  * @func
  * @sig Iterable a → AsyncIterator a
  * @example
  * from([1, 2, 3]); // AsyncIterator(1, 2, 3)
*/
export const from = map(R.identity);

/** Return the next item, or a default value if iterable is empty
  * @func
  * @async
  * @sig a → Iterable a → Promise a
  * @example
  * await nextOr(10, from([1, 2, 3])); // 1
  * await nextOr(10, from([])); // 10
*/
export const nextOr = R.curry(async (or, iterator) => {
  iterator = from(iterator);
  const { value, done } = await iterator.next();
  return done ? or : value;
});

/** Returns the first or "next" item. a.k.a. "head". Throws StopIterationError if empty
  * @func
  * @async
  * @sig Iterable a → Promise a
  * @example
  * await next(from([1, 2, 3])); // 1
  * await next(from([])); // StopIterationError()
*/
export const next = async iterator => {
  iterator = from(iterator);
  const err = new StopIteration();
  const out = await nextOr(err, iterator);
  if (out === err) throw err;
  return out;
};

/** Returns the last item
  * @func
  * @sig Iterable a → Promise a
  * @example await last(from(1, 2, 3)); // 3
*/
export const last = async xs => {
  // should this throw for empty iterators, like next?
  let last;
  for await (const x of xs) last = x;
  return last;
};

/** Maps a function over an iterable and concatenates the results. a.k.a. "chain"
  * @func
  * @sig (a → Iterable b) → Iterable a → AsyncIterator b
  * @example
  * const iterator = from([1, 2, 3]);
  *
  * // AsyncIterator(1, 2, 2, 4, 3, 6)
  * flatMap(async function* (n) {
  *   yield await n;
  *   yield await n * 2;
  * }, iterator);
*/
export const flatMap = R.curry(async function* (f, xs) {
  for await (const x of xs) yield* await f(x);
});

/** Create an async iterator from one or more (variadic) arguments
  * @func
  * @sig ...a → AsyncIterator a
  * @example
  * of(1, 2, 3); // AsyncIterator(1, 2, 3)
*/
export const of = R.unapply(from);

/** Like `reduce`, but yields each intermediate result
  * @func
  * @sig ((a, b) → Promise a) → a → Iterable b → AsyncIterator a
  * @example
  * // AsyncIterator(1, 1, 2, 6, 24)
  * scan(R.multiply, 1, from([1, 2, 3, 4]));
*/
export const scan = R.curry(async function* (f, acc, xs) {
  yield acc;
  yield* map(async x => (acc = await f(acc, x)), xs);
});

/** Reduce all items to a single item
  * @async
  * @func
  * @sig ((a, b) → Promise a) → a → Iterable b → Promise a
  * @example
  * // 6
  * await reduce(async (a, b) => a + b, 0, from([1, 2, 3]));
*/
export const reduce = asyncPipeC(scan, last);

/** Zip multiple async iterators with custom zipping function
  * @func
  * @sig ((...a) → Promise b) → [Iterable a] → AsyncIterator b
  * @example
  * // AsyncIterator([7, 4, 1], [8, 5, 2], [9, 6, 3])
  * zipAllWith(async (a, b, c) => [c, b, a], [
  *   from([1, 2, 3]),
  *   from([4, 5, 6]),
  *   from([7, 8, 9]),
  * ]);
*/
export const zipAllWith = R.curry(async function* (func, iterators) {
  iterators = R.map(from, iterators);
  while (true) {
    // todo: run this in parallel?
    const { done, values } = await reduceP(async (out, iterator) => {
      // todo: make R.reduced(out) work here
      if (out.done) return out;
      const { value, done } = await iterator.next();
      return R.evolve({
        values: R.append(value),
        done: R.or(done),
      }, out);
    }, { done: false, values: [] }, iterators);
    if (done) return;
    yield await func(...values);
  }
});

/** Zip an array of iterables into an async iterator of arrays of items from corresponding indices
  * of the input iterables
  * @func
  * @sig [Iterable a, Iterable b, Iterable c, ...] → AsyncIterator [a, b, c, ...]
  * @example
  * // AsyncIterator([1, 4, 7], [2, 5, 8], [3, 6, 9])
  * zipAll([
  *   from([1, 2, 3]),
  *   from([4, 5, 6]),
  *   from([7, 8, 9]),
  * ]);
*/
export const zipAll = zipAllWith(Array.of);


/** Zip `n` async iterables with a custom zipping function
  * @func
  * @sig
  * @example
  * // AsyncIterator([4, 1], [5, 2], [6, 3])
  * zipWithN(2)(async (a, b) => [b, a])(
  *   from([1, 2, 3]),
  *   from([4, 5, 6]),
  * );
*/
export const zipWithN = n => R.curryN(n + 1)((f, ...iterables) => zipAllWith(f, iterables));

/** Zip two async iterables with a custom zipping function
  * @func
  * @sig ((a, b) → Promise c) → Iterable a → Iterable b → AsyncIterator c
  * @example
  * // AsyncIterator([4, 1], [5, 2], [6, 3])
  * zipWith(async (a, b) => [b, a])(from([1, 2, 3]), from([4, 5, 6]));
*/
export const zipWith = zipWithN(2);

/** Zips two iterables into pairs of items from corresponding indices
  * of the input iterables. Truncated to shorter of two iterables
  * @func
  * @sig Iterable a → Iterable b → AsyncIterator [a, b]
  * @example
  * // AsyncIterator([1, 4], [2, 5], [3, 6])
  * zip(from([1, 2, 3]), from([4, 5, 6]));
*/
export const zip = zipWith(Array.of);

/** Iterates between two numbers with variable step. Inclusive start, exclusive stop
  * @func
  * @sig Number → Number → Number → AsyncIterator Number
  * @example
  * // AsyncIterator(0, 15, 30, 45, 60, 75, 90)
  * rangeStep(15, 0, 100);
*/
export const rangeStep = R.curry(async function* (step, start, stop) {
  if (step === 0) return;
  const cont = i => (step > 0 ? i < stop : i > stop);
  for (let i = start; cont(i); i += step) yield await i;
});

/** Iterates between two numbers. Inclusive start, exclusive stop
  * @func
  * @sig Number → Number → AsyncIterator Number
  * @example
  * range(0, 5); // AsyncIterator(0, 1, 2, 3, 4)
*/
export const range = rangeStep(1);

/** Yield [index, item] pairs
  * @func
  * @sig Iterable a → AsyncIterator [Integer, a]
  * @example
  * // AsyncIterator([0, 'zero'], [1, 'one'], [2, 'two'])
  * enumerate(from(['zero', 'one', 'two']));
*/
export const enumerate = xs => zip(range(0, Infinity), xs);

// accumulate is to scan, like reduce with no init
// todo: consider ditching this. scan is more useful
// ((a, b) → Promise a) → Iterable b → AsyncIterator a
export const accumulate = R.curry((f, xs) => {
  let last;
  return map(async ([i, x]) => {
    return (last = i ? await f(last, x) : x);
  }, enumerate(xs));
});

/** Slice an iterator between two indices. Inclusive start, exclusive stop
  * @func
  * @sig Integer → Integer → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(3, 4, 5)
  * slice(2, 5, from([1, 2, 3, 4, 5, 6, 7, 8]));
*/
export const slice = R.curry(async function* (start, stop, xs) {
  for await (const [i, x] of enumerate(xs)) {
    if (i >= start) yield x;
    if (i >= stop - 1) return;
  }
});

/** Concatenate two async iterables
  * @func
  * @sig Iterable a → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(1, 2, 3, 4, 5, 6)
  * concat(from([1, 2, 3]), from([4, 5, 6]));
*/
export const concat = R.curry(async function* (xs1, xs2) {
  yield* xs1;
  yield* xs2;
});

/** Prepends an item `a`
  * @func
  * @sig a → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(0, 1, 2, 3)
  * prepend(0, from([1, 2, 3]));
*/
export const prepend = R.useWith(concat, [of, R.identity]);

/** Appends an item `a`
  * @func
  * @sig a → Iterable a → AsyncIterator a
  * @example append(4, from([1, 2, 3])); // AsyncIterator(1, 2, 3, 4)
*/
export const append = R.useWith(R.flip(concat), [of, R.identity]);

/** Run a function (side-effect) once for each item
  * @func
  * @sig (a → Promise b) → Iterable a → AsyncIterator a
  * @example
  * // log 1
  * // log 2
  * // log 3
  * // AsyncIterator(1, 2, 3)
  * forEach(console.log, from([1, 2, 3]));
*/
export const forEach = R.curry(async function* (f, xs) {
  // eslint-disable-next-line no-unused-expressions
  for await (const x of xs) await f(x), yield x;
});

/** Yield only items that pass the predicate
  * @func
  * @sig (a → Promise Boolean) → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(1, 2, 3, 4)
  * filter(async n => (n < 5), from([1, 2, 3, 4, 5, 6, 7, 8]));
*/
export const filter = R.curry(async function* (f, xs) {
  for await (const x of xs) if (await f(x)) yield x;
});

/** Yield only items that do not pass the predicate
  * @func
  * @sig (a → Promise Boolean) → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(6, 7, 8)
  * reject(async n => (n < 5), from(1, 2, 3, 4, 5, 6, 7, 8));
*/
export const reject = R.useWith(filter, [complementP, R.identity]);

/** Flattens n-levels of a nested iterable of iterables
  * @func
  * @sig Number → Iterable Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(1, 2, 3, [4])
  * flattenN(2, from([1, [2, [3, [4]]]]))
*/
export const flattenN = R.curry((n, xs) => {
  if (n < 1) return xs;
  return flatMap(async function* (x) {
    if (!(isIterable(x) || isAsyncIterable(x))) return yield x;
    yield* flattenN(n - 1, x);
  }, xs);
});

/** Flattens one level of a nested iterable of iterables
  * @func
  * @sig Iterable Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(1, 2, [3, [4]])
  * unnest(from([1, [2, [3, [4]]]]));
*/
export const unnest = flattenN(1);

/** Flattens a nested iterable of iterables into a single iterable
  * @func
  * @sig Iterable Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(1, 2, 3, 4)
  * unnest(from([1, [2, [3, [4]]]]));
*/
export const flatten = flattenN(Infinity);

/** Unfold
  * @func
  * @todo would be better to use an option type here
  * can this be done whilst maintaining operability with non-monad returns?
  * @sig (a → Promise [a, a]) → a → AsyncIterator a
  * @example
  * // AsyncIterator(1, 2, 4, 8)
  * unfold(async n => (n < 10 ? [n, n * 2] : false), 1);
*/
export const unfold = R.curry(async function* (f, x) {
  let pair = await f(x);
  while (pair && pair.length) {
    yield pair[0];
    pair = await f(pair[1]);
  }
});

// (a → Promise [Iterable b, a]) → a → AsyncIterator b
export const flatUnfold = pipeC(unfold, unnest);

/** Recursively call a function, yielding items from each resulting iterable
  * @func
  * @sig (a → Iterable a) → a → AsyncIterator a
  * @example
  * // AsyncIterator(0, 0, 1, 2, 2, 4, 3, 6, 4, 8, ...)
  * flatIterate(async function* (n) {
  *   yield await n;
  *   yield await (n * 2);
  *   return n + 1;
  * }, 0));
*/
export const flatIterate = R.curry(async function* flatIterate(f, x) {
  while (true) x = yield* await f(x);
});


/** Recursively call a function, yielding each result
  * @func
  * @sig (a → Promise a) → a → AsyncIterator a
  * @example
  * // AsyncIterator(0, 2, 4, 6, 8, 10, ...)
  * iterate(async n => n + 2, 0);
*/
export const iterate = R.useWith(unfold, [
  f => async x => [x, await f(x)],
  R.identity,
]);

/** Does any item pass the predicate?
  * @async
  * @func
  * @sig (a → Promise Boolean) → Iterable a → Promise Boolean
  * @example
  * // true
  * await some(async n => (n > 5), from([1, 2, 3, 4, 5, 6]));
*/
export const some = R.curry(async (f, xs) => {
  for await (const x of xs) if (await f(x)) return true;
  return false;
});


/** Do all items fail the predicate?
  * @async
  * @func
  * @sig (a → Promise Boolean) → Iterable a → Promise Boolean
  * @example
  * // true
  * await none(async n => (n > 5), from([1, 2, 3, 4, 5]));
*/
export const none = complementP(some);

/** Drop duplicate items. Duplicates determined by custom comparator
  * @async
  * @func
  * @sig ((a, a) → Promise Boolean) → Iterable a → AsyncIterator a
  * @example
  * const records = from([{ id: 1 }, { id: 2 }, { id: 1 }]);
  * // AsyncIterator({ id: 1 }, { id: 2 })
  * uniqueWith(async (a, b) => (a.id === b.id), records);
*/
export const uniqueWith = R.curry(async function* (f, xs) {
  const seen = [];
  const add = saw => seen.push(saw);
  const has = async x => some(saw => f(x, saw), seen);
  yield* filter(async x => {
    if (await has(x)) return false;
    add(x);
    return true;
  }, xs);
});

/** Drop duplicate items. Duplicates determined by strict equality
  * @func
  * @sig Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(1, 2, 3, 4)
  * unique(from([1, 1, 2, 3, 4, 4, 4]));
*/
export const unique = async function* (xs) {
  const set = new Set();
  yield* filter(x => {
    if (set.has(x)) return;
    set.add(x);
    return true;
  }, xs);
};

/** Yield only the first `n` items
  * @func
  * @sig Integer → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(1, 2, 3)
  * take(3, from(1, 2, 3, 4, 5));
*/
export const take = R.curry(async function* (n, xs) {
  if (n <= 0) return;
  yield* slice(0, n, xs);
});

/** Yield all but the first `n` items
  * @func
  * @sig Integer → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(4, 5)
  * drop(3, from(1, 2, 3, 4, 5));
*/
export const drop = R.curry((n, xs) => slice(n, Infinity, xs));

/** Yield all but the first item
  * @func
  * @sig Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(2, 3, 4, 5)
  * tail(from(1, 2, 3, 4, 5));
*/
export const tail = drop(1);

/** Infinitely yield an item `a`
  * @func
  * @sig a → AsyncIterator a
  * @example
  * // AsyncIterator('hi', 'hi', 'hi', ...)
  * repeat('hi');
*/
export const repeat = iterate(R.identity);

/** Yield an item `a`, `n` times. a.k.a. "replicate"
  * @func
  * @sig Integer → a → AsyncIterator a
  * @example
  * // AsyncIterator('hi', 'hi', 'hi', 'hi')
  * times(4, 'hi');
*/
export const times = R.useWith(take, [R.identity, repeat]);

/** Returns the number of items in the iterable. Exhausts input
  * @func
  * @async
  * @sig Iterable a → Promise Integer
  * @example
  * // 5
  * await length(from([1, 2, 3, 4, 5]));
*/
export const length = reduce(R.add(1), 0);


/** Return the number of items in an iterable. Exhasts the input iterator
  * @func
  * @async
  * @sig (a → Promise Boolean) → Iterable a → Promise Integer
  * @example
  * // 4
  * await count(async n => (n > 3), from([1, 2, 3, 4, 5, 6, 7]));
*/
export const count = pipeC(filter, length);

/** Sum by
  * @func
  * @async
  * @sig (a → Promise Number) → Iterable a → Promise Number
  * @example
  * const iterator = from([{ total: 1 }, { total: 2 }, { total: 3 }]);
  * // 6
  * await sumBy(R.prop('total'), iterator);
*/
export const sumBy = pipeC(map, reduce(R.add, 0));

/** Min by
  * @func
  * @sig (a → Promise Number) → Iterable a → Promise Number
  * @example
  * const iterator = from([{ total: 1 }, { total: 2 }, { total: 3 }]);
  * // 1
  * await minBy(R.prop('total'), iterator);
*/
export const minBy = pipeC(map, reduce(Math.min, Infinity));

/** Max by
  * @func
  * @sig (a → Promise Number) → Iterable a → Promise Number
  * @example
  * const iterator = from([{ total: 1 }, { total: 2 }, { total: 3 }]);
  * // 3
  * await maxBy(R.prop('total'), iterator);
*/
export const maxBy = pipeC(map, reduce(Math.max, -Infinity));

/** Sum of all items
  * @func
  * @sig Iterable Number → Promise Number
  * @example await sum(from([1, 2, 3])); // 6
*/
export const sum = sumBy(R.identity);

/** Get the minimum value
  * @func
  * @sig Iterable Number → Promise Number
  * @example await min(from([1, 2, 3])); // 1
*/
export const min = minBy(R.identity);

/** Get the maximumm value
  * @func
  * @sig Iterable Number → Promise Number
  * @example await max(from([1, 2, 3])); // 3
*/
export const max = maxBy(R.identity);

/** Resolves an async iterable to an array. Exhausts input iterator
  * @func
  * @sig Iterable a → Promise [a]
  * @example await toArray(from([1, 2, 3])); // [1, 2, 3]
*/
export const toArray = reduce(R.flip(R.append), []);

/** Returns the item at the nth index
  * @func
  * @sig Integer → Iterable a → Promise a
  * @example
  * // 'b'
  * await nth(1, from(['a', 'b', 'c', 'd']));
*/
export const nth = R.curry(async (n, xs) => {
  for await (const [i, x] of enumerate(xs)) {
    if (i === n) return x;
  }
});

/** Do all items pass the predicate?
  * @func
  * @async
  * @sig (a → Promise Boolean) → Iterable a → Promise Boolean
  * @example
  * // false
  * await every(async n => (n < 4), from([1, 2, 3, 4]));
*/
export const every = R.curry(async (f, xs) => {
  for await (const x of xs) if (!await f(x)) return false;
  return true;
});

/** Returns the first item that passes the predicate
  * @func
  * @async
  * @sig (a → Promise Boolean) → Iterable a → Promise a
  * @example
  * const records = [{ id: 1 }, { id: 2 }, { id: 3 }];
  * // { id: 2 }
  * await find(async record => (record.id === 2), records);
*/
export const find = R.curry(async (f, xs) => {
  for await (const x of xs) if (await f(x)) return x;
});

/** Returns the first index at which the item passes the predicate
  * @func
  * @async
  * @sig (a → Promise Boolean) → Iterable a → Promise Integer
  * @example
  * const records = [{ id: 1 }, { id: 2 }, { id: 3 }];
  * // 1
  * await find(async record => (record.id === 2), records);
*/
export const findIndex = R.curry(async (f, xs) => {
  for await (const [i, x] of enumerate(xs)) {
    if (await f(x)) return i;
  }
  return -1;
});

/** Yield all items
  * @func
  * @todo should return inputs
  * @async
  * @sig Iterable a → Promise undefined
  * @example
  * // AsyncIterator(1, 2, 3)
  * const iterator = from([1, 2, 3]);
  * // AsyncIterator()
  * await exhaust(iterator);
*/
export const exhaust = async xs => {
  for await (const _ of xs);
};

/** Yield items until the predicate returns false
  * @func
  * @sig (a → Promise Boolean) → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(2, 3, 4)
  * takeWhile(async n => (n < 5), from([2, 3, 4, 5, 6, 1]));
*/
export const takeWhile = R.curry(async function* (f, xs) {
  for await (const x of xs) {
    if (!await f(x)) return;
    yield x;
  }
});

/** Drop items until the predicate returns false
  * @func
  * @sig (a → Promise Boolean) → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(5, 6, 1)
  * dropWhile(async n => (n < 5), from([2, 3, 4, 5, 6, 1]));
*/
export const dropWhile = R.curry(async function* (f, xs) {
  xs = from(xs);
  for await (const x of xs) {
    if (!await f(x)) return yield* prepend(x, xs);
  }
});

/** Reverse an iterable. Requires storing *all* items in memory
  * @func
  * @todo: there might be a more efficient strategy for arrays. generators are not iterable in reverse
  * @sig Iterable a → AsyncIterator a
  * @example reverse(from([1, 2, 3])); // AsyncIterator(3, 2, 1)
*/
export const reverse = async function* (xs) {
  yield* (await toArray(xs)).reverse();
};

/** Sort items. Requires storing *all* items in memory
  * @func
  * @sig ((a, a) → Promise Number) → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator('c', 'b', 'a')
  * sort(async (a, b) => b.localeCompare(a), from(['a', 'b', 'c']));
*/
export const sort = R.useWith(R.sort, [R.identity, toArray]);

/** Yield a sliding "window" of length `n`. Caches `n` items
  * @func
  * @sig Integer → Iterable a → AsyncIterator [a]
  * @example
  * // AsyncIterator([0, 1, 2], [1, 2, 3], [2, 3, 4], [4, 5, 6])
  * frame(3, from([0, 1, 2, 3, 4, 5, 6]));
*/
export const frame = R.curry(async function* (n, xs) {
  const cache = [];
  yield* flatMap(async function* (x) {
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
  * @sig Number → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(1, 2, 3)
  * dropLast(2, from([1, 2, 3, 4, 5]));
*/
export const dropLast = R.curry(async function* (n, xs) {
  const done = new StopIteration();
  for await (const group of frame(n + 1, append(done, xs))) {
    if (R.last(group) === done) return;
    yield R.head(group);
  }
});


/** Yield all but the last item
  * @func
  * @sig Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(1, 2, 3, 4)
  * init(from([1, 2, 3, 4, 5]));
*/
export const init = dropLast(1);

// a → Iterable a → Promise Integer
export const indexOf = R.useWith(findIndex, [is, R.identity]);

// a → Iterable a → Promise Boolean
export const includes = R.useWith(some, [is, R.identity]);


/** Yield groups of items where the predicate returns truthy for adjacent items
  * @func
  * @sig ((a, a) → Promise Boolean) → Iterable a → AsyncIterator [a]
  * @example
  * // AsyncIterator([1, 1, 1], [2, 2], [3])
  * groupWith(async n => n, from([1, 1, 1, 2, 2, 3]));
*/
export const groupWith = R.curry(async function* (f, xs) {
  let last, group = [];
  yield* flatMap(async function* ([i, x]) {
    if (i && !await f(last, x)) {
      yield group;
      group = [];
    }
    group.push(last = x);
  }, enumerate(xs));
  if (group.length) yield group;
});

/** Yield groups of items where the adjacent items are strictly equal
  * @func
  * @sig Iterable a → AsyncIterator [a]
  * @example
  * // AsyncIterator([1, 1, 1], [2, 2], [3])
  * group(from([1, 1, 1, 2, 2, 3]));
*/
export const group = groupWith(is);


/** Copy an async iterator `n` times. Exhausts input iterators
  * @func
  * @sig Integer → Iterable a → [AsyncIterator a]
  * @example
  * // [AsyncIterator(1, 2, 3), AsyncIterator(1, 2, 3), AsyncIterator(1, 2, 3)]
  * tee(3, from([1, 2, 3]));
*/
export const tee = R.curry((n, xs) => {
  xs = from(xs);
  return [...Array(n)]
    .map(() => [])
    .map(async function* (cache, i, caches) {
      while (true) {
        if (!cache.length) {
          const { done, value } = await xs.next();
          if (done) {
            if (cache.length) yield* cache;
            return;
          }
          for (const cache of caches) cache.push(value);
        }
        yield cache.shift();
      }
    });
});

/** Yield groups of length `n`
  * @func
  * @sig Integer → Iterable a → AsyncIterator [a]
  * @example
  * // AsyncIterator([0, 1, 2], [3, 4, 5], [6, 7, 8])
  * splitEvery(3, from([0, 1, 2, 3, 4, 5, 6, 7, 8]));
*/
export const splitEvery = R.curry(async function* (n, xs) {
  let group = [];
  yield* flatMap(async function* (x) {
    group.push(x);
    if (group.length < n) return;
    yield group;
    group = [];
  }, xs);
  if (group.length) yield group;
});

/** Split an async iterable into a pair of iterables at a particular index
  * @func
  * @sig Integer → Iterable a → [AsyncIterator a, AsyncIterator a]
  * @example
  * // [AsyncIterator(0, 1, 2, 3, 4), AsyncIterator(5, 6)]
  * splitAt(4, from([0, 1, 2, 3, 4, 5, 6]));
*/
export const splitAt = R.curry((n, xs) => {
  const [it1, it2] = tee(2, xs);
  return [take(n, it1), drop(n, it2)];
});

/** Split an async iterable into a pair of iterables based on the truthiness of their predicate
  * @func
  * @sig (a → Promise Boolean) → Iterable a → [AsyncIterator a, AsyncIterator a]
  * @example
  * // [AsyncIterator(0, 1, 2), AsyncIterator(3, 4, 5, 6)]
  * partition(async n => n < 3, from([0, 1, 2, 3, 4, 5, 6]));
*/
export const partition = R.curry((f, xs) => {
  const [pass, fail] = tee(2, xs);
  return [filter(f, pass), reject(f, fail)];
});

/** Yield all items from an async iterable, `n` times. Requires caching all items in the iterable
  * @func
  * @sig Integer → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(1, 2, 1, 2, 1, 2)
  * cycleN(3, from([1, 2]));
*/
export const cycleN = R.curry(async function* (n, xs) {
  if (n < 1) return;
  const buffer = [];
  yield* forEach(x => buffer.push(x), xs);
  while (n-- > 1) yield* buffer;
});

/** Yield iterable items cyclically, infinitely looping when the input is exhausted
  * @func
  * @sig Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator(1, 2, 3, 1, 2, 3, ...)
  * cycle(from([1, 2, 3]));
*/
export const cycle = cycleN(Infinity);


/** Transforms an iterable of n-tuple into an n-tuple of async iterators
  * @func
  * @sig Number → Iterable [a, b, ...] → [AsyncIterator a, AsyncIterator b, ...]
  * @example
  * // [AsyncIterator(1, 4, 7), AsyncIterator(2, 5, 8), AsyncIterator(3, 6, 9)]
  * unzipN(3, from([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
*/
export const unzipN = pipeC(tee, R.addIndex(R.map)((xs, i) => map(nth(i), xs)));

/** Transforms an iterable of pairs into a pair of AsyncIterator
  * @func
  * @sig Iterable [a, b] → [AsyncIterator a, AsyncIterator b]
  * @example
  * // [AsyncIterator(1, 3, 5), AsyncIterator(2, 4, 6)]
  * unzip(from([[1, 2], [3, 4], [5, 6]]));
*/
export const unzip = unzipN(2);

/** Insert an item `a` between every item in the iterable
  * @func
  * @sig a → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator('a', '-', 'b', '-', 'c')
  * intersperse('-', from('a', 'b', 'c'));
*/
export const intersperse = R.useWith(flatMap, [
  spacer => ([i, x]) => (i ? [spacer, x] : [x]),
  enumerate,
]);

/** Serialize items to a string with an arbitrary spacer
  * @todo consider taking a function instead of a string
  * @func
  * @async
  * @sig String → Iterable a → Promise String
  * @example
  * // 'some-slug-parts';
  * await joinWith('-', from(['some', 'slug', 'parts']));
*/
export const joinWith = pipeC(
  intersperse,
  reduce(R.unapply(R.join('')), ''),
);

/** Serialize items to a string
  * @func
  * @sig Iterable a → Promise String
  * @example
  * // 'abcde'
  * await join(from(['a', 'b', 'c', 'd', 'e']));
*/
export const join = joinWith('');

/** Is an iterable empty? (done or length = 0)
  * @func
  * @sig Iterable a → Promise Boolean
  * @example
  * await isEmpty(from([])); // true
  * await isEmpty(from([1])); // false
*/
export const isEmpty = none(R.T);

/** Check if two async iterables match at every index as determined by a custom comparator
  * @func
  * @sig ((a, b) → Promise Boolean) → Iterable a → Iterable b → Promise Boolean
  * @example
  * const one = from([{ id: 1 }, { id: 2 }, { id: 3 }]);
  * const two = from([{ id: 1 }, { id: 2 }, { id: 3 }]);
  * // true
  * await correspondsWith(R.prop('id'), one, two);
*/
export const correspondsWith = R.useWith(async (func, iterator1, iterator2) => {
  let done;
  do {
    // resolve next values in parallel
    const [
      { done: done1, value: value1 },
      { done: done2, value: value2 },
    ] = await Promise.all([
      iterator1.next(),
      iterator2.next(),
    ]);
    
    // different lengths imply not corresponding
    if (done1 !== done2) return false;
    done = (done1 && done2);
    if (!done && !await func(value1, value2)) return false;
  } while (!done);
  return true;
}, [R.identity, from, from]);

// Iterable a → Iterable a → Promise Boolean
export const corresponds = correspondsWith(is);

/** Get an iterator of indices (0 to length - 1)
  * @func
  * @sig Iterable a → AsyncIterator Integer
  * @example
  * // AsyncIterator(0, 1, 2)
  * indices(from(['a', 'b', 'c']));
*/
export const indices = R.pipe(enumerate, map(R.head));

/** Pad an iterable with with a finite number of items `a`
  * @func
  * @sig Integer → a → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator('a', 'b', 'c', 'd', 'd', 'd')
  * padTo(6, 'd', from(['a', 'b', 'c']));
*/
export const padTo = R.curry(async function* (len, padder, xs) {
  let n = 0;
  yield* forEach(x => n++, xs);
  if (n < len) yield* times(len - n, padder);
});

/** Pad iterable with an infinite number of items `a`
  * @func
  * @sig a → Iterable a → AsyncIterator a
  * @example
  * // AsyncIterator('a', 'b', 'c', 'd', 'd', 'd', ...)
  * pad('d', from(['a', 'b', 'c']));
*/
export const pad = padTo(Infinity);


// const unionWith = R.curry(() => {});
// const union = unionWith(is);

// const intersectWith = R.curry(() => {});
// const intersect = intersectWith(is);

// const combinations = R.curry(async function* () {});
// const permutations = R.curry(async function* (n, iterable) {});
//
// // https://www.learnrxjs.io/operators/combination/combinelatest.html
// const combineLatest = () => {};
//
// // (a → Promise<*>) → Iterable a → Promise<Undefined>
// const subscribe = pipeC(forEach, exhaust);
//
// const retryN = R.curry(async function* (n, xs) {
//   let tries = 0;
//   try {
//     for await (const x of xs) yield x;
//   } catch (err) {
//     if (tries >= n) throw err;
//     tries++;
//   }
// });
//
// const retry = retryN(1);
//
// // https://github.com/jamiemccrindle/axax/blob/master/src/subject.ts
// const deferred = () => {
//   const defs = [];
//   let done = false;
//   let error;
//   return {
//     return: (value) => {
//       done = true;
//       for (const def of defs) def.resolve({ done, value });
//       return;
//     },
//     throw: async (err) => {
//       done = true;
//       error = err;
//       for (const def of defs) def.reject(err);
//       throw err;
//     },
//     next: async (value) => {
//       if (done) {
//         for (const def of defs) def.resolve({ done: true, value });
//       }
//     },
//     iterator: {
//       next: async () => {
//
//       },
//     },
//   };
// };
//
// // https://github.com/tc39/proposal-async-iteration/issues/126#issuecomment-427426383
// // eslint-disable-next-line max-statements
// const mergeAll = async function* (iterators) {
//   try {
//     const ps = new Map(iterators.map((iterator, i) => [i, iterator.next().then(r => ({ r, i }))]));
//     while (ps.size) {
//       const { r, i } = await Promise.race(ps.values());
//       if (r.done) {
//         ps.delete(i);
//       } else {
//         ps.set(i, iterators[i].next().then(r => ({ r, i })));
//         yield r.value;
//       }
//     }
//   } finally {
//     for (const iterator of iterators) {
//       iterator.return();
//     }
//   }
// };
//
// // eslint-disable-next-line max-statements
// const merge = R.curry((iterator1, iterator2) => mergeAll([iterator1, iterator2]));
