/* eslint-disable func-names */

// modules
import * as R from 'ramda';

// aliased
import { pipeC } from 'funk-lib/function';
import { pipeC as asyncPipeC, reduce as reduceP } from 'funk-lib/async';
import { is, isIterable } from 'funk-lib/is';

// local
import StopIteration from './stop-iteration';

// fixme: polyfill Symbol.asyncIterator
// https://github.com/babel/babel/issues/8450
// https://github.com/babel/babel/issues/7467
import 'core-js/modules/es7.symbol.async-iterator';

export { yieldWithAsync as yieldWith } from './yield-with';

const complementP = f => R.curryN(f.length)(async (...args) => !await f(...args));

// todo: consider replacing "is" with R.equals

// * -> Iterable<T> -> Promise<T|*>
export const nextOr = R.curry(async (or, iterator) => {
  const { value, done } = await iterator.next();
  return done ? or : value;
});

// returns the first or "next" item. aka head
// Iterable<T> -> Promise<T>
export const next = async iterator => {
  const err = new StopIteration();
  const out = await nextOr(err, iterator);
  if (out === err) throw err;
  return out;
};

// returns the last item
// Iterable<T> -> Promise<T>
export const last = async xs => {
  let last;
  for await (const x of xs) last = x;
  return last;
};

// (A -> Iterable<B>) -> Iterable<A> -> AsyncIterator<B>
export const flatMap = R.curry(async function* (f, xs) {
  for await (const x of xs) yield* await f(x);
});

// (A -> Promise<B>) -> Iterable<A> -> AsyncIterator<B>
export const map = R.curry(async function* (f, xs) {
  for await (const x of xs) yield await f(x);
});

// returns an iterator from an iterable
// Iterable<T> -> AsyncIterator<T>
export const from = map(R.identity);

// create an iterator of one or more (variadic) arguments
// T... -> AsyncIterator<T>
export const of = R.unapply(from);

// ((A, T) -> Promise<A>) -> A -> Iterable<T> -> AsyncIterator<A>
export const scan = R.curry(async function* (f, acc, xs) {
  yield acc;
  yield* map(async x => (acc = await f(acc, x)), xs);
});

// ((A, T) -> Promise<A>) -> A -> Iterable<T> -> Promise<A>
export const reduce = asyncPipeC(scan, last);

// ((...A) -> Promise<B>) -> [Iterable<A>] -> AsyncIterator<B>
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
// [Iterable<A>] -> AsyncIterator<B>
export const zipAll = zipAllWith(Array.of);

export const zipWithN = n => R.curryN(n + 1)((f, ...iterables) => zipAllWith(f, iterables));

// ((A, B) -> Promise<C>) -> Iterable<A> -> Iterable<B> -> AsyncIterator<C>
export const zipWith = zipWithN(2);

// "zips" two iterables into pairs of items from corresponding indices
// of the input iterables. truncated to shorter of two iterables
// Iterable<A> -> Iterable<B> -> AsyncIterator<[A, B]>
export const zip = zipWith(Array.of);

// iterates from 0 to n by with a step (exclusive)
// Number -> Number -> Number -> AsyncIterator<Number>
export const rangeStep = R.curry(async function* (step, start, stop) {
  if (step === 0) return;
  const cont = i => (step > 0 ? i < stop : i > stop);
  for (let i = start; cont(i); i += step) yield await i;
});

// iterates from 0 to n - 1 (exclusive)
// Number -> Number -> AsyncIterator<Number>
export const range = rangeStep(1);

// transform an iterable to an iterable of pairs of indices and their items
// Iterable<T> -> AsyncIterator<[Integer, T]>
export const enumerate = xs => zip(range(0, Infinity), xs);

// accumulate is to scan, like reduce with no init
// todo: consider ditching this. scan is more useful
// ((A, T) -> Promise<A>) -> Iterable<T> -> AsyncIterator<A>
export const accumulate = R.curry((f, xs) => {
  let last;
  return map(async ([i, x]) => {
    return (last = i ? await f(last, x) : x);
  }, enumerate(xs));
});

// Integer -> Integer -> Iterable<T> -> AsyncIterator<T>
export const slice = R.curry(async function* (start, stop, xs) {
  for await (const [i, x] of enumerate(xs)) {
    if (i >= start) yield x;
    if (i >= stop - 1) return;
  }
});

// yield all items from one iterator, then the other
// Iterable<T> -> Iterable<T> -> AsyncIterator<T>
export const concat = R.curry(async function* (xs1, xs2) {
  yield* xs1;
  yield* xs2;
});

// prepend an item (T) to the end of an iterable
// T -> Iterable<T> -> AsyncIterator<T>
export const prepend = R.useWith(concat, [of, R.identity]);

// append an item (T) to the start of an iterable
// T -> Iterable<T> -> AsyncIterator<T>
export const append = R.useWith(R.flip(concat), [of, R.identity]);

// run a function (side-effect) once for each item
// (T -> Promise<*>) -> Iterable<T> -> AsyncIterator<T>
export const forEach = R.curry(async function* (f, xs) {
  // eslint-disable-next-line no-unused-expressions
  for await (const x of xs) await f(x), yield x;
});

// yield only items that pass the predicate
// (T -> Promise<Boolean>) -> Iterable<T> -> AsyncIterator<T>
export const filter = R.curry(async function* (f, xs) {
  for await (const x of xs) if (await f(x)) yield x;
});

// yield only items that do not pass the predicate
// (T -> Promise<Boolean>) -> Iterable<T> -> AsyncIterator<T>
export const reject = R.useWith(filter, [complementP, R.identity]);

// (A -> AsyncIterator<B>) -> A -> AsyncIterator<B>
export const flatUnfold = R.curry(async function* (f, x) {
  do {
    x = yield* await f(x);
  } while (x);
});

// (A -> Promise<[B, A]>) -> * -> AsyncIterator<B>
export const unfold = R.curry(async function* (f, x) {
  let pair = await f(x);
  while (pair && pair.length) {
    yield pair[0];
    pair = await f(pair[1]);
  }
});

// iterate infinitely, yielding items from seed through a predicate
// (T -> Promise<T>) -> T -> AsyncIterator<T>
export const iterate = R.useWith(unfold, [
  f => async x => [x, await f(x)],
  R.identity,
]);

// todo: consider calling this any
// does any item pass the predicate?
// (T -> Promise<Boolean>) -> Iterable<T> -> Promise<Boolean>
export const some = R.curry(async (f, xs) => {
  for await (const x of xs) if (await f(x)) return true;
  return false;
});

// do all items fail the predicate?
// (T -> Promise<Boolean>) -> Iterable<T> -> Promise<Boolean>
export const none = complementP(some);

// yield only items that are unique by their predicate
// ((T, T) -> Promise<Boolean>) -> Iterable<T> -> AsyncIterator<T>
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
// Iterable<T> -> AsyncIterator<T>
export const unique = async function* (xs) {
  const set = new Set();
  yield* filter(x => {
    if (set.has(x)) return;
    set.add(x);
    return true;
  }, xs);
};

// yield only the first n items of an iterable
// Integer -> Iterable<T> -> AsyncIterator<T>
export const take = R.curry(async function* (n, xs) {
  if (n <= 0) return;
  yield* slice(0, n, xs);
});

// drop the first n items of an iterable
// Integer -> Iterable<T> -> AsyncIterator<T>
export const drop = R.curry((n, xs) => slice(n, Infinity, xs));

// yield all but the first item
// Iterable<T> -> AsyncIterator<T>
export const tail = drop(1);

// infinitely yield an item (T)
// T -> Iterator<T>
export const repeat = iterate(R.identity);

// yield an item (T) n times
// aka replicate
// Integer -> T -> AsyncIterator<T>
export const times = R.useWith(take, [R.identity, repeat]);

// Iterable<T> -> Promise<Integer>
export const length = reduce(R.add(1), 0);

// return the number of items in an iterable. exhasts input
// (T -> Promise<Boolean>) -> Iterable<T> -> Promise<Integer>
export const count = pipeC(filter, length);

// (T -> Promise<Number>) -> Iterable<T> -> Promise<Number>
export const sumBy = pipeC(map, reduce(R.add, 0));

// (T -> Promise<Number>) -> Iterable<T> -> Promise<Number>
export const minBy = pipeC(map, reduce(Math.min, Infinity));

// (T -> Promise<Number>) -> Iterable<T> -> Promise<Number>
export const maxBy = pipeC(map, reduce(Math.max, -Infinity));

// Iterable<Number> -> Promise<Number>
export const sum = sumBy(R.identity);

// Iterable<Number> -> Promise<Number>
export const min = minBy(R.identity);

// Iterable<Number> -> Promise<Number>
export const max = maxBy(R.identity);

// transforms an iterable to an array. exhasts input
// Iterable<T> -> Promise<[T]>
export const toArray = reduce(R.flip(R.append), []);

// returns the element at the nth index
// Integer -> Iterable<T> -> Promise<T|Undefined>
export const nth = R.curry(async (n, xs) => {
  for await (const [i, x] of enumerate(xs)) {
    if (i === n) return x;
  }
});

// do all items pass their predicate?
// (T -> Promise<Boolean>) -> Iterable<T> -> Promise<Boolean>
export const every = R.curry(async (f, xs) => {
  for await (const x of xs) if (!await f(x)) return false;
  return true;
});

// (T -> Promise<Boolean>) -> Iterable<T> -> Promise<T|Undefined>
export const find = R.curry(async (f, xs) => {
  for await (const x of xs) if (await f(x)) return x;
});

// (T -> Promise<Boolean>) -> Iterable<T> -> Promise<Integer>
export const findIndex = R.curry(async (f, xs) => {
  for await (const [i, x] of enumerate(xs)) {
    if (await f(x)) return i;
  }
  return -1;
});

// yield all items
// Iterable<T> -> Promise<Undefined>
export const exhaust = async xs => {
  for await (const _ of xs);
};

// (T -> Promise<Boolean>) -> Iterable<T> -> AsyncIterator<T>
export const takeWhile = R.curry(async function* (f, xs) {
  for await (const x of xs) {
    if (!await f(x)) return;
    yield x;
  }
});

// (T -> Promise<Boolean>) -> Iterable<T> -> AsyncIterator<T>
export const dropWhile = R.curry(async function* (f, xs) {
  xs = from(xs);
  for await (const x of xs) {
    if (!await f(x)) return yield* prepend(x, xs);
  }
});

// todo: there might be a more efficient strategy for arrays
// generators are not iterable in reverse
// Iterable<T> -> AsyncIterator<T>
export const reverse = async function* (xs) {
  yield* (await toArray(xs)).reverse();
};

// fixme
// ((T, T) -> Promise<Number>) -> Iterable<T> -> AsyncIterator<T>
export const sort = R.useWith(R.sort, [R.identity, toArray]);

// yield a sliding "window" of length n
// note: caches of n items
// Integer -> Iterable<T> -> AsyncIterator<[T]>
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
// Number -> Iterable<T> -> AsyncIterator<T>
export const dropLast = R.curry(async function* (n, xs) {
  const done = new StopIteration();
  for await (const group of frame(n + 1, append(done, xs))) {
    if (R.last(group) === done) return;
    yield R.head(group);
  }
});

// yield all but the last 1 item
// Iterable<T> -> AsyncIterator<T>
export const init = dropLast(1);

// T -> Iterable<T> -> Promise<Integer>
export const indexOf = R.useWith(findIndex, [is, R.identity]);

// * -> Iterable<T> -> Promise<Boolean>
export const includes = R.useWith(some, [is, R.identity]);

// yield groups of items where the predicate returns truthy
// for all adjacent items
// ((T , T) -> Promise<Boolean>) -> Iterable<T> -> AsyncIterator<[T]>
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

// Iterable<T> -> AsyncIterator<[T]>
export const group = groupWith(is);

// copy an iterator n times (exhausts its input)
// Integer -> Iterable<T> -> [AsyncIterator<T>]
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
// Integer -> Iterable<T> -> AsyncIterator<[T]>
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

// split an iterable into a pair of iterables at a particular index
// Integer -> Iterable<T> -> [AsyncIterator<T>, AsyncIterator<T>]
export const splitAt = R.curry((n, xs) => {
  const [it1, it2] = tee(2, xs);
  return [take(n, it1), drop(n, it2)];
});

// split an iterable into a pair of iterables based on the truthiness of their predicate
// (T -> Promise<Boolean>) -> Iterable<T> -> [AsyncIterator<T>, AsyncIterator<T>]
export const partition = R.curry((f, xs) => {
  const [pass, fail] = tee(2, xs);
  return [filter(f, pass), reject(f, fail)];
});

// flattens n-levels of a nested iterable of iterables
// Number -> Iterable<Iterable<T>> -> AsyncIterator<T>
export const flattenN = R.curry((n, xs) => {
  if (n < 1) return xs;
  return flatMap(async function* (x) {
    if (!isIterable(x)) return yield x;
    yield* flattenN(n - 1, x);
  }, xs);
});

// flattens one level of a nested iterable of iterables
// Iterable<Iterable<T>> -> AsyncIterator<T>
export const unnest = flattenN(1);

// flattens a nested iterable of iterables into a single iterable
// Iterable<Iterable<T>> -> AsyncIterator<T>
export const flatten = flattenN(Infinity);

// yield all items from an iterator, n times
// Integer -> Iterable<T> -> AsyncIterator<T>
export const cycleN = R.curry(async function* (n, xs) {
  if (n < 1) return;
  const buffer = [];
  yield* forEach(x => buffer.push(x), xs);
  while (n-- > 1) yield* buffer;
});

// yield iterable items cyclically, infinitely looping when exhausted
// Iterable<T> -> AsyncIterator<T>
export const cycle = cycleN(Infinity);

// transforms an iterable of n-tuple into an n-tuple of iterables
// Number -> Iterable<[A, B, ...Z]> -> [AsyncIterator<A>, AsyncIterator<B>, ...AsyncIterator<Z>]
export const unzipN = pipeC(tee, R.addIndex(R.map)((xs, i) => map(nth(i), xs)));

// transforms an iterable of pairs into a pairs of iterables
// Iterable<[A, B]> -> [AsyncIterator<A>, AsyncIterator<B>]
export const unzip = unzipN(2);

// insert an item (T) between every item in the iterable
// T -> Iterable<T> -> AsyncIterator<T>
export const intersperse = R.useWith(flatMap, [
  spacer => ([i, x]) => (i ? [spacer, x] : [x]),
  enumerate,
]);

// serialize iterator items to a string with an arbitrary spacer
// String -> Iterable<T> -> Promise<String>
export const joinWith = pipeC(
  intersperse,
  reduce(R.unapply(R.join('')), ''),
);

// serialize iterator items to a string
// Iterable<T> -> Promise<String>
export const join = joinWith('');

// is an iterable empty? (done or length = 0)
// Iterable<T> -> Promise<Boolean>
export const isEmpty = none(R.T);

// ((T, T) -> Promise<Boolean>) -> Iterable<T> -> Iterable<T> -> Promise<Boolean>
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

// Iterable<T> -> Iterable<T> -> Promise<Boolean>
export const corresponds = correspondsWith(is);

// get an iterator of indices (0 to length - 1)
// Iterable<T> -> AsyncIterator<Integer>
export const indices = R.pipe(enumerate, map(R.head));

// pad an iterable with with a finite number of items (T)
// Integer -> T -> Iterable<T> -> AsyncIterator<T>
export const padTo = R.curry(async function* (len, padder, xs) {
  let n = 0;
  yield* forEach(x => n++, xs);
  if (n < len) yield* times(len - n, padder);
});

// pad iterable with an infinite number of items (T)
// T -> Iterable<T> -> AsyncIterator<T>
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
// // (T -> Promise<*>) -> Iterable<T> -> Promise<Undefined>
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
