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
import 'core-js/modules/es7.symbol.async-iterator';

export { yieldWithAsync as yieldWith } from './yield-with';

const complementP = f => R.curryN(f.length)(async (...args) => !await f(...args));

// todo: consider replacing "is" with R.equals

/** Applies a function to each of an async iterable's yielded items. Works on all iterables
  * @func
  * @sig (a -> Promise<b>) -> Iterable<a> -> AsyncIterator<b>
  * @example
  * const iterator = from([1, 2, 3])
  *
  * // from([2, 4, 6])
  * map(async n => n * 2, iterator)
*/
export const map = R.curry(async function* (f, xs) {
  for await (const x of xs) yield await f(x);
});

/** Returns an async iterator from an iterable
  * @func
  * @sig Iterable<a> -> AsyncIterator<a>
  * @example
  * from([1, 2, 3]) // AsyncIterator<1, 2, 3>
*/
export const from = map(R.identity);

// b -> Iterable<a> -> Promise<a|b>
export const nextOr = R.curry(async (or, iterator) => {
  iterator = from(iterator);
  const { value, done } = await iterator.next();
  return done ? or : value;
});

// returns the first or "next" item. aka head
// Iterable<a> -> Promise<a>
export const next = async iterator => {
  iterator = from(iterator);
  const err = new StopIteration();
  const out = await nextOr(err, iterator);
  if (out === err) throw err;
  return out;
};

// returns the last item
// Iterable<a> -> Promise<a>
export const last = async xs => {
  // should this throw for empty iterators, like next?
  let last;
  for await (const x of xs) last = x;
  return last;
};

/** Maps a function over an iterable and concatenates the results. a.k.a. "chain"
  * @func
  * @sig (a -> Iterable<b>) -> Iterable<a> -> AsyncIterator<b>
  * @example
  * const iterator = from([1, 2, 3])
  *
  * // from([1, 2, 2, 4, 3, 6])
  * flatMap(async function* (n) {
  *   yield await n;
  *   yield await n * 2;
  * }, iterator);
*/
export const flatMap = R.curry(async function* (f, xs) {
  for await (const x of xs) yield* await f(x);
});


/** Create an iterator of one or more (variadic) arguments
  * @func
  * @sig ...a -> AsyncIterator<a>
  * @example
  * of(1, 2, 3); // AsyncIterator<1, 2, 3>
*/
export const of = R.unapply(from);

// ((a, b) -> Promise<a>) -> a -> Iterable<b> -> AsyncIterator<a>
export const scan = R.curry(async function* (f, acc, xs) {
  yield acc;
  yield* map(async x => (acc = await f(acc, x)), xs);
});

/** reduce
  * @async
  * @func
  * @sig ((a, b) -> Promise<a>) -> a -> Iterable<b> -> Promise<a>
  * @example
  * const iterator = from([1, 2, 3]);
  * await reduce((a, b) => a + b, 0, iterator); // 6
*/
export const reduce = asyncPipeC(scan, last);

// ((...a) -> Promise<b>) -> [Iterable<a>] -> AsyncIterator<b>
export const zipAllWith = R.curry(async function* (func, iterators) {
  iterators = R.map(from, iterators);
  while (true) {
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

// zip an array of iterables into an iterables of arrays of items from corresponding indices
// of the input iterables
// [Iterable<a>] -> AsyncIterator<b>
export const zipAll = zipAllWith(Array.of);

export const zipWithN = n => R.curryN(n + 1)((f, ...iterables) => zipAllWith(f, iterables));

/** zip with
  * @func
  * @sig ((a, b) -> Promise<c>) -> Iterable<a> -> Iterable<b> -> AsyncIterator<c>
*/
export const zipWith = zipWithN(2);


/** "zips" two iterables into pairs of items from corresponding indices
  * of the input iterables. truncated to shorter of two iterables
  * @func
  * @sig Iterable<a> -> Iterable<b> -> AsyncIterator<[a, b]>
  * @example
  * zip(from([1, 2, 3]), from([4, 5, 6])); // from([[1, 4], [2, 5], [3, 6]])
*/
export const zip = zipWith(Array.of);


/** iterates from 0 to n by with a step (exclusive)
  * @func
  * @sig Number -> Number -> Number -> AsyncIterator<Number>
*/
export const rangeStep = R.curry(async function* (step, start, stop) {
  if (step === 0) return;
  const cont = i => (step > 0 ? i < stop : i > stop);
  for (let i = start; cont(i); i += step) yield await i;
});

/** iterates from 0 to n - 1 (exclusive)
  * @func
  * @sig Number -> Number -> AsyncIterator<Number>
  * @example
  * range(0, 5) // from([0, 1, 2, 3, 4])
*/
export const range = rangeStep(1);

/** transform an iterable to an iterable of pairs of indices and their items
  * @func
  * @sig Iterable<a> -> AsyncIterator<[Integer, a]>
  * @example
  * const iterator = from(['zero', 'one', 'two'])
  * enumerate(iterator) // from([[0, 'zero'], [1, 'one'], [2, 'two']])
*/
export const enumerate = xs => zip(range(0, Infinity), xs);

// accumulate is to scan, like reduce with no init
// todo: consider ditching this. scan is more useful
// ((a, b) -> Promise<a>) -> Iterable<b> -> AsyncIterator<a>
export const accumulate = R.curry((f, xs) => {
  let last;
  return map(async ([i, x]) => {
    return (last = i ? await f(last, x) : x);
  }, enumerate(xs));
});

/** slice
  * @func
  * @sig Integer -> Integer -> Iterable<a> -> AsyncIterator<a>
*/
export const slice = R.curry(async function* (start, stop, xs) {
  for await (const [i, x] of enumerate(xs)) {
    if (i >= start) yield x;
    if (i >= stop - 1) return;
  }
});

/** yield all items from one iterator, then the other
  * @func
  * @sig Iterable<a> -> Iterable<a> -> AsyncIterator<a>
*/
export const concat = R.curry(async function* (xs1, xs2) {
  yield* xs1;
  yield* xs2;
});

/** Prepend an item (T) to the end of an iterable
  * @func
  * @sig a -> Iterable<a> -> AsyncIterator<a>
*/
export const prepend = R.useWith(concat, [of, R.identity]);

/** Append an item (T) to the start of an iterable
  * @func
  * @sig a -> Iterable<a> -> AsyncIterator<a>
*/
export const append = R.useWith(R.flip(concat), [of, R.identity]);

/** run a function (side-effect) once for each item
  * @func
  * @sig (a -> Promise<b>) -> Iterable<a> -> AsyncIterator<a>
*/
export const forEach = R.curry(async function* (f, xs) {
  // eslint-disable-next-line no-unused-expressions
  for await (const x of xs) await f(x), yield x;
});

/** yield only items that pass the predicate
  * @func
  * @sig (a -> Promise<Boolean>) -> Iterable<a> -> AsyncIterator<a>
*/
export const filter = R.curry(async function* (f, xs) {
  for await (const x of xs) if (await f(x)) yield x;
});

/** Yield only items that do not pass the predicate
  * @func
  * @sig (a -> Promise<Boolean>) -> Iterable<a> -> AsyncIterator<a>
*/
export const reject = R.useWith(filter, [complementP, R.identity]);

// flattens n-levels of a nested iterable of iterables
// Number -> Iterable<Iterable<a>> -> AsyncIterator<a>
export const flattenN = R.curry((n, xs) => {
  if (n < 1) return xs;
  return flatMap(async function* (x) {
    if (!(isIterable(x) || isAsyncIterable(x))) return yield x;
    yield* flattenN(n - 1, x);
  }, xs);
});


/** Flattens one level of a nested iterable of iterables
  * @func
  * @sig Iterable<Iterable<a>> -> AsyncIterator<a>
*/
export const unnest = flattenN(1);

// Flattens a nested iterable of iterables into a single iterable
// Iterable<Iterable<a>> -> AsyncIterator<a>
export const flatten = flattenN(Infinity);

// todo: would be better to use an option type here
// can this be done whilst maintaining operability with non-monad returns?
// (a -> Promise<[b, a]>) -> * -> AsyncIterator<b>
export const unfold = R.curry(async function* (f, x) {
  let pair = await f(x);
  while (pair && pair.length) {
    yield pair[0];
    pair = await f(pair[1]);
  }
});

// (a -> Promise<[Iterable<b>, a]>) -> * -> AsyncIterator<b>
export const flatUnfold = pipeC(unfold, unnest);

/** Flat iterate
  * @func
  * @sig (a -> Iterable<a>) -> a -> AsyncIterator<a>
*/
export const flatIterate = R.curry(async function* flatIterate(f, x) {
  while (true) x = yield* await f(x);
});

/** Iterate infinitely, yielding items from seed through a predicate
  * @func
  * @sig (a -> Promise<a>) -> a -> AsyncIterator<a>
*/
export const iterate = R.useWith(unfold, [
  f => async x => [x, await f(x)],
  R.identity,
]);

/** Does any item pass the predicate?
  * @func
  * @sig (a -> Promise<Boolean>) -> Iterable<a> -> Promise<Boolean>
*/
export const some = R.curry(async (f, xs) => {
  for await (const x of xs) if (await f(x)) return true;
  return false;
});

/** Do all items fail the predicate?
  * @func
  * @sig (a -> Promise<Boolean>) -> Iterable<a> -> Promise<Boolean>
*/
export const none = complementP(some);

// yield only items that are unique by their predicate
// ((a, a) -> Promise<Boolean>) -> Iterable<a> -> AsyncIterator<a>
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

// yield only the unique items in an iterable (by strict equality)
// Iterable<a> -> AsyncIterator<a>
export const unique = async function* (xs) {
  const set = new Set();
  yield* filter(x => {
    if (set.has(x)) return;
    set.add(x);
    return true;
  }, xs);
};

/** Yield only the first n items of an iterable
  * @func
  * @sig Integer -> Iterable<a> -> AsyncIterator<a>
*/
export const take = R.curry(async function* (n, xs) {
  if (n <= 0) return;
  yield* slice(0, n, xs);
});

/** Drop the first n items of an iterable
  * @func
  * @sig Integer -> Iterable<a> -> AsyncIterator<a>
*/
export const drop = R.curry((n, xs) => slice(n, Infinity, xs));

/** Yield all but the first item
  * @func
  * @sig Iterable<a> -> AsyncIterator<a>
*/
export const tail = drop(1);

/** Infinitely yield an item (a)
  * @func
  * @sig a -> Iterator<a>
*/
export const repeat = iterate(R.identity);

/** Yield an item (a) n times. aka replicate
  * @func
  * @sig Integer -> a -> AsyncIterator<a>
*/
export const times = R.useWith(take, [R.identity, repeat]);

/** Get length of iterable
  * @func
  * @sig Iterable<a> -> Promise<Integer>
*/
export const length = reduce(R.add(1), 0);

// return the number of items in an iterable. exhasts input
// (a -> Promise<Boolean>) -> Iterable<a> -> Promise<Integer>
export const count = pipeC(filter, length);

/** Sum by
  * @func
  * @sig (a -> Promise<Number>) -> Iterable<a> -> Promise<Number>
*/
export const sumBy = pipeC(map, reduce(R.add, 0));

// (a -> Promise<Number>) -> Iterable<a> -> Promise<Number>
export const minBy = pipeC(map, reduce(Math.min, Infinity));

// (a -> Promise<Number>) -> Iterable<a> -> Promise<Number>
export const maxBy = pipeC(map, reduce(Math.max, -Infinity));

/** Sum
  * @func
  * @sig Iterable<Number> -> Promise<Number>
*/
export const sum = sumBy(R.identity);

// Iterable<Number> -> Promise<Number>
export const min = minBy(R.identity);

/** Max
  * @func
  * @sig Iterable<Number> -> Promise<Number>
*/
export const max = maxBy(R.identity);

/** Transforms an iterable to an array. exhasts input
  * @func
  * @sig Iterable<a> -> Promise<[a]>
*/
export const toArray = reduce(R.flip(R.append), []);

// returns the element at the nth index
// Integer -> Iterable<a> -> Promise<a|undefined>
export const nth = R.curry(async (n, xs) => {
  for await (const [i, x] of enumerate(xs)) {
    if (i === n) return x;
  }
});

/** do all items pass their predicate?
  * @func
  * @async
  * @sig (a -> Promise<Boolean>) -> Iterable<a> -> Promise<Boolean>
*/
export const every = R.curry(async (f, xs) => {
  for await (const x of xs) if (!await f(x)) return false;
  return true;
});

/** find
  * @func
  * @async
  * @sig (a -> Promise<Boolean>) -> Iterable<a> -> Promise<a|undefined>
*/
export const find = R.curry(async (f, xs) => {
  for await (const x of xs) if (await f(x)) return x;
});

/** find index
  * @func
  * @async
  * @sig (a -> Promise<Boolean>) -> Iterable<a> -> Promise<Integer>
*/
export const findIndex = R.curry(async (f, xs) => {
  for await (const [i, x] of enumerate(xs)) {
    if (await f(x)) return i;
  }
  return -1;
});

/** Yield all items
  * @func
  * @async
  * @sig Iterable<a> -> Promise<undefined>
*/
export const exhaust = async xs => {
  for await (const _ of xs);
};

/** Take while
  * @func
  * @sig (a -> Promise<Boolean>) -> Iterable<a> -> AsyncIterator<a>
*/
export const takeWhile = R.curry(async function* (f, xs) {
  for await (const x of xs) {
    if (!await f(x)) return;
    yield x;
  }
});

/** Drop while
  * @func
  * @sig (a -> Promise<Boolean>) -> Iterable<a> -> AsyncIterator<a>
*/
export const dropWhile = R.curry(async function* (f, xs) {
  xs = from(xs);
  for await (const x of xs) {
    if (!await f(x)) return yield* prepend(x, xs);
  }
});

// todo: there might be a more efficient strategy for arrays
// generators are not iterable in reverse
// Iterable<a> -> AsyncIterator<a>
export const reverse = async function* (xs) {
  yield* (await toArray(xs)).reverse();
};

// fixme
// ((a, a) -> Promise<Number>) -> Iterable<a> -> AsyncIterator<a>
export const sort = R.useWith(R.sort, [R.identity, toArray]);

// yield a sliding "window" of length n
// note: caches of n items
// Integer -> Iterable<a> -> AsyncIterator<[a]>
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

// yield all but the last n items
// note: caches n + 1 items
// Number -> Iterable<a> -> AsyncIterator<a>
export const dropLast = R.curry(async function* (n, xs) {
  const done = new StopIteration();
  for await (const group of frame(n + 1, append(done, xs))) {
    if (R.last(group) === done) return;
    yield R.head(group);
  }
});

// yield all but the last 1 item
// Iterable<a> -> AsyncIterator<a>
export const init = dropLast(1);

// T -> Iterable<a> -> Promise<Integer>
export const indexOf = R.useWith(findIndex, [is, R.identity]);

// * -> Iterable<a> -> Promise<Boolean>
export const includes = R.useWith(some, [is, R.identity]);

// yield groups of items where the predicate returns truthy
// for all adjacent items
// ((a, a) -> Promise<Boolean>) -> Iterable<a> -> AsyncIterator<[a]>
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

/** Group
  * @func
  * @sig Iterable<a> -> AsyncIterator<[a]>
*/
export const group = groupWith(is);

// copy an iterator n times (exhausts its input)
// Integer -> Iterable<a> -> [AsyncIterator<a>]
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

// yield groups of length n
// Integer -> Iterable<a> -> AsyncIterator<[a]>
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

/** Split an iterable into a pair of iterables at a particular index
  * @func
  * @sig Integer -> Iterable<a> -> [AsyncIterator<a>, AsyncIterator<a>]
*/
export const splitAt = R.curry((n, xs) => {
  const [it1, it2] = tee(2, xs);
  return [take(n, it1), drop(n, it2)];
});

// split an iterable into a pair of iterables based on the truthiness of their predicate
// (a -> Promise<Boolean>) -> Iterable<a> -> [AsyncIterator<a>, AsyncIterator<a>]
export const partition = R.curry((f, xs) => {
  const [pass, fail] = tee(2, xs);
  return [filter(f, pass), reject(f, fail)];
});

/** Yield all items from an iterator, n times
  * @func
  * @sig Integer -> Iterable<a> -> AsyncIterator<a>
*/
export const cycleN = R.curry(async function* (n, xs) {
  if (n < 1) return;
  const buffer = [];
  yield* forEach(x => buffer.push(x), xs);
  while (n-- > 1) yield* buffer;
});

/** yield iterable items cyclically, infinitely looping when exhausted
  * @func
  * @sig Iterable<a> -> AsyncIterator<a>
  * @example
  * const iterator = from([1, 2, 3]);
  * cycle(iterator) // AsyncIterator<1, 2, 3, 1, 2, 3, ...>
*/
export const cycle = cycleN(Infinity);

// transforms an iterable of n-tuple into an n-tuple of iterables
// Number -> Iterable<[A, B, ...Z]> -> [AsyncIterator<A>, AsyncIterator<B>, ...AsyncIterator<Z>]
export const unzipN = pipeC(tee, R.addIndex(R.map)((xs, i) => map(nth(i), xs)));

// transforms an iterable of pairs into a pairs of iterables
// Iterable<[A, B]> -> [AsyncIterator<A>, AsyncIterator<B>]
export const unzip = unzipN(2);

// insert an item (T) between every item in the iterable
// a -> Iterable<a> -> AsyncIterator<a>
export const intersperse = R.useWith(flatMap, [
  spacer => ([i, x]) => (i ? [spacer, x] : [x]),
  enumerate,
]);

// serialize iterator items to a string with an arbitrary spacer
// String -> Iterable<a> -> Promise<String>
export const joinWith = pipeC(
  intersperse,
  reduce(R.unapply(R.join('')), ''),
);

/** Serialize iterator items to a string
  * @func
  * @sig Iterable<a> -> Promise<String>
*/
export const join = joinWith('');

/** Is an iterable empty? (done or length = 0)
  * @func
  * @sig Iterable<a> -> Promise<Boolean>
*/
export const isEmpty = none(R.T);

// ((a, a) -> Promise<Boolean>) -> Iterable<a> -> Iterable<a> -> Promise<Boolean>
export const correspondsWith = R.useWith(async (func, iterator1, iterator2) => {
  let done;
  do {
    const { done: done1, value: value1 } = await iterator1.next();
    const { done: done2, value: value2 } = await iterator2.next();
    if (done1 !== done2) return false;
    done = (done1 && done2);
    if (!done && !await func(value1, value2)) return false;
  } while (!done);
  return true;
}, [R.identity, from, from]);

// Iterable<a> -> Iterable<a> -> Promise<Boolean>
export const corresponds = correspondsWith(is);

/** Get an iterator of indices (0 to length - 1)
  * @func
  * @sig Iterable<a> -> AsyncIterator<Integer>
*/
export const indices = R.pipe(enumerate, map(R.head));

// pad an iterable with with a finite number of items (T)
// Integer -> a -> Iterable<a> -> AsyncIterator<a>
export const padTo = R.curry(async function* (len, padder, xs) {
  let n = 0;
  yield* forEach(x => n++, xs);
  if (n < len) yield* times(len - n, padder);
});

// pad iterable with an infinite number of items (T)
// a -> Iterable<a> -> AsyncIterator<a>
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
// // (a -> Promise<*>) -> Iterable<a> -> Promise<Undefined>
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
