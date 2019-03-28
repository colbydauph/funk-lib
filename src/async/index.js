// modules
import * as R from 'ramda';

// aliased
import { isObject, isIterator } from 'funk-lib/is';
// import { map: mapIterable } from 'funk-lib/iterable/sync';

// local
import mapLimitCallback from './map-limit-cb';

export class TimeoutError extends Error {}

/** Resolve promises in parallel
  * @async
  * @func
  * @sig [Promise<a>] → [a]
  * @example
  * // [1, 2, 3]
  * await all([
  *   Promise.resolve(1),
  *   2,
  *   Promise.resolve(3),
  * ]);
*/
export const all = Promise.all.bind(Promise);

/** Returns a promise that resolves or rejects as soon as one of the promises in an
  * iterable resolves or rejects, with the value or reason from that promise.
  * @async
  * @func
  * @sig [Promise<a>] → a
  * @example
  * // true
  * await race([
  *   delay(1).then(_ => true),
  *   delay(10).then(_ => false),
  *   delay(100).then(_ => throw Error('oops')),
  * ]);
*/
export const race = Promise.race.bind(Promise);

/** Promise returning setTimeout
  * @async
  * @func
  * @sig Number → Promise<undefined>
  * @example await delay(100); // resolved in 100ms
*/
export const delay = async ms => new Promise(res => setTimeout(res, ms));

/** Defers invoking a function until the current call stack has cleared. Passes args to deferred function.
  * @async
  * @func
  * @sig [a] → (a → b) → Promise<b>
  * @example await deferWith([1, 2], (a, b) => a + b); // 3
*/
export const deferWith = R.curry((args, f) => delay(1).then(_ => f(...args)));

/** Defers invoking a function until the current call stack has cleared
  * @async
  * @func
  * @sig (a → b) → Promise<b>
  * @example await defer(_ => 3); // 3
*/
export const defer = deferWith([]);

/** Wraps a function to always return a promise
  * @async
  * @func
  * @sig (a → b) → (a → Promise<b>)
  * @example
  * const pred = n => n > 5;
  * const asyncPred = toAsync(pred);
  * asyncPred(2); // Promise<false>
*/
export const toAsync = f => async (...args) => f(...args);

/** Returns a promise that is resolved by an err-back function
  * @func
  * @example
  * await fromCallback(cb => cb(null, 123)); // 123
  * await fromCallback(cb => cb(Error('oops'))); // Error('oops')
*/
export const fromCallback = async f => {
  return new Promise((resolve, reject) => {
    f((err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

/** Wrap a function to retry based on a predicate function
  * @func
  * @async
  * @sig Number → (a → b) → (a → Promise<b>)
  * @example
  * // retry 10 times with exponential backoff
  * const retry = retryWith(i => {
  *   return (i < 10)
  *     ? return 50 * Math.pow(2, i)
  *     : false;
  * });
  * const data = await retry(getData)('https://foo.bar');
*/
export const retryWith = R.curry((f, func) => {
  let retryCount = 0;
  return async (...args) => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        return await func(...args);
      } catch (err) {
        const int = await f(++retryCount);
        if (int === false) throw err;
        await delay(+int);
      }
    }
  };
});


/** Make an errback-calling function promise-returning. Inverse of callbackify
  * @async
  * @func
  * @example
  * const callback = (n, cb) => cb(null, n + 1);
  * await promisify(callback)(1); // 2
*/
export const promisify = f => async (...args) => {
  return fromCallback(cb => f(...args, cb));
};

/** Make a promise-returning function errback-yielding. Inverse of promisify
  * @async
  * @func
  * @example
  * const func = async n => n + 1;
  * await callbackify(func)(1, (err, res) => {
  *   // err = null, res = 2
  * });
*/
export const callbackify = f => (...args) => {
  const cb = args.pop();
  toAsync(f)(...args)
    .then(res => cb(null, res))
    .catch(err => cb(err));
};

/** Creates an externally controlled promise
  * @async
  * @func
  * @sig * → Object
  * @example
  * const { promise, resolve, reject } = deferred();
  * resolve(123);
  * await promise; // 123
*/
export const deferred = () => {
  let resolve, reject;
  return {
    promise: new Promise((...args) => {
      [resolve, reject] = args;
    }),
    resolve,
    reject,
  };
};


/** Async reduce
  * @async
  * @func
  * @sig ((a, b) → Promise<a>) → a → [b] → Promise<a>
  * @example
  * // 15
  * await reduce(async (a, n) => a + n, 0, [1, 2, 3, 4, 5]);
*/
export const reduce = R.curry(async (f, acc, xs) => {
  for (const x of xs) acc = await f(acc, x);
  return acc;
});

/** serial + async R.pipe. works with sync or async functions
  * @async
  * @func
  * @sig (...f) → f
  * @example
  * // 4
  * await pipe(
  *   async n => n + 1,
  *   async n => n * 2,
  * )(1);
*/
export const pipe = (f, ...fs) => async (...args) => {
  return reduce(R.applyTo, await f(...args), fs);
};

/** Curried async pipe
  * @async
  * @func
  * @sig (...f) → f
  * @example
  * const math = pipeC(
  *   async (a, b) => a + b,
  *   c => (c * 2),
  *   async c => (c + 1),
  * );
  * await math(2)(5) // 21;
*/
export const pipeC = (...f) => R.curryN(f[0].length, pipe(...f));

/** Map with variable parallelization
  * @async
  * @func
  * @sig Number → (a → Promise<b>) → [a] → Promise<[b]>
  * @example
  * // [2, 4, 6, 8, 10]
  * await mapLimit(2, async n => (n * 2), [1, 2, 3, 4, 5]);
*/
export const mapLimit = R.curry(async (limit, f, xs) => {
  if (isIterator(xs)) xs = [...xs];
  
  let before = R.identity;
  let after = R.identity;
  let asyncF = f;
      
  if (isObject(xs)) {
    before = R.toPairs;
    after = R.fromPairs;
    asyncF = async item => {
      const res = await f(item[1]);
      return [item[0], res];
    };
  }
  return promisify(mapLimitCallback)(
    before(xs),
    limit,
    callbackify(asyncF),
  ).then(after);
});

/** For each with variable parallelization
  * @async
  * @func
  * @sig Number → (a → Promise<b>) → [a] → Promise<[a]>
  * @example
  * // 1
  * // 2
  * // 3
  * await forEachLimit(2, async n => console.log(n), [1, 2, 3]);
*/
export const forEachLimit = R.curry(async (limit, f, xs) => {
  await mapLimit(limit, f, xs);
  return xs;
});

/** Every with variable parallelization
  * @async
  * @func
  * @sig Number → (a → Promise<Boolean>) → [a] → Promise<Boolean>
  * @example
  * // false
  * await everyLimit(2, async n => (n > 4), [1, 2, 3, 4, 5]);
*/
export const everyLimit = R.curry(async (limit, f, xs) => {
  return new Promise(async resolve => {
    await forEachLimit(limit, async x => {
      if (!await f(x)) resolve(false);
    }, xs);
    resolve(true);
  });
});

/** Some with variable parallelization
  * @async
  * @func
  * @sig Number → (a → Promise<Boolean>) → [a] → Promise<Boolean>
  * @example
  * // true
  * await someLimit(2, async n => (n > 4), [1, 2, 3, 4, 5]);
*/
export const someLimit = R.curry(async (limit, f, xs) => {
  return new Promise(async resolve => {
    await forEachLimit(limit, async x => {
      if (await f(x)) resolve(true);
    }, xs);
    resolve(false);
  });
});

/** Find with variable parallelization
  * @async
  * @func
  * @sig Number → (a → Promise<Boolean>) → [a] → Promise<a>
  * @example
  * const records = [{ id: 1 }, { id: 2 }, { id: 3 }];
  *
  * // { id: 2 }
  * await findLimit(2, async ({ id }) => (id === 2), records);
*/
export const findLimit = R.curry(async (limit, f, xs) => {
  return new Promise(async (resolve, reject) => {
    await forEachLimit(limit, async x => {
      if (await f(x)) resolve(x);
    }, xs)
      // resolve undefined if none found
      .then(() => resolve())
      .catch(reject);
  });
});

/** Flat map (aka. "chain") with variable parallelization
  * @async
  * @func
  * @sig Number → (a → Promise<[b]>) → [a] → Promise<[b]>
  * @example
  * const array = [1, 2, 3];
  *
  * // [1, 2, 2, 4, 3, 6]
  * await flatMapLimit(2, async n => [n, n * 2], array);
*/
export const flatMapLimit = pipeC(mapLimit, R.chain(R.identity));


/** Flat map pairs with variable parallelization
  * @async
  * @func
  * @sig Number → ([a, b] → Promise<[[c, d]]>) → { a: b } → Promise<{ c: d }>
*/
export const flatMapPairsLimit = R.curry(async (limit, f, object) => {
  return R.fromPairs(await flatMapLimit(limit, f, R.toPairs(object)));
});

/** Map pairs with variable parallelization
  * @async
  * @func
  * @sig Number → ([a, b] → Promise<[c, d]>) → { a: b } → Promise<{ c: d }>
  * @example
  * // { 1: 'a', 2: 'b', 3: 'c' }
  * await mapPairsLimit(2, async pair => pair.reverse(), { a: 1, b: 2, c: 3 });
*/
export const mapPairsLimit = R.curry(async (limit, f, object) => {
  return R.fromPairs(await mapLimit(limit, f, R.toPairs(object)));
});

/** Filter with variable parallelization
  * @async
  * @func
  * @sig Number → (a → Promise<Boolean>) → [a] → Promise<[a]>
  * @example
  * const array = [1, 2, 3, 4, 5];
  *
  * // [1, 2]
  * await filterLimit(2, async n => (n < 3), array);
*/
export const filterLimit = R.curry(async (limit, f, xs) => {
  return flatMapLimit(limit, async x => (await f(x) ? [x] : []), xs);
});

/** All settled with variable parallelization
  * @async
  * @func
  * @sig Number → [Promise] → Promise<[{ status, value, reason }]>
*/
export const allSettledLimit = R.curry((limit, promises) => {
  return mapLimit(limit, promise => {
    return Promise
      .resolve(promise)
      .then(value => ({ status: 'fulfilled', value }))
      .catch(reason => ({ status: 'rejected', reason }));
  }, promises);
});

/** Parallel map
  * @async
  * @func
  * @sig (a → Promise<b>) → [a] → Promise<[b]>
  * @example
  * const array = [1, 2, 3, 4, 5];
  *
  * // [2, 4, 6, 8, 10]
  * await map(async n => (n * 2), array);
*/
export const map = mapLimit(Infinity);

/** Serial map
  * @async
  * @func
  * @sig (a → Promise<b>) → [a] → Promise<[b]>
  * @example
  * const array = [1, 2, 3, 4, 5];
  *
  * // [2, 4, 6, 8, 10]
  * await mapSeries(async n => (n * 2), array);
*/
export const mapSeries = mapLimit(1);

/** Parallel flat map pairs
  * @async
  * @func
  * @sig ([a, b] → Promise<[[c, d]]>) → { a: b } → Promise<{ c: d }>
*/
export const flatMapPairs = flatMapPairsLimit(Infinity);

/** Serial flat map pairs
  * @async
  * @func
  * @sig ([a, b] → Promise<[[c, d]]>) → { a: b } → Promise<{ c: d }>
*/
export const flatMapPairsSeries = flatMapPairsLimit(1);

/** Parallel map pairs
  * @async
  * @func
  * @sig ([a, b] → Promise<[c, d]>) → { a: b } → Promise<{ c: d }>
  * @example
  * // { 1: 'a', 2: 'b', 3: 'c' }
  * await mapPairs(async pair => pair.reverse(), { a: 1, b: 2, c: 3 });
*/
export const mapPairs = mapPairsLimit(Infinity);

/** Serial map pairs
  * @async
  * @func
  * @sig ([a, b] → Promise<[c, d]>) → { a: b } → Promise<{ c: d }>
  * @example
  * // { 1: 'a', 2: 'b', 3: 'c' }
  * await mapPairsSeries(async pair => pair.reverse(), { a: 1, b: 2, c: 3 });
*/
export const mapPairsSeries = mapPairsLimit(1);

/** Parallel for each
  * @async
  * @func
  * @sig (a → Promise<b>) → [a] → Promise<[a]>
  * @example
  * // log 1
  * // log 2
  * // log 3
  * // [1, 2, 3]
  * await forEach(async n => console.log(n), [1, 2, 3]);
*/
export const forEach = forEachLimit(Infinity);

/** Serial for each
  * @async
  * @func
  * @sig (a → Promise<b>) → [a] → Promise<[a]>
  * @example
  * // log 1
  * // log 2
  * // log 3
  * // [1, 2, 3]
  * await forEachSeries(async n => console.log(n), [1, 2, 3]);
*/
export const forEachSeries = forEachLimit(1);

/** Parallel every
  * @async
  * @func
  * @sig (a → Promise<Boolean>) → [a] → Promise<Boolean>
  * @example
  * // false
  * await every(async n => (n > 5), [4, 5, 6, 7]);
*/
export const every = everyLimit(Infinity);

/** Serial every
  * @async
  * @func
  * @sig (a → Promise<Boolean>) → [a] → Promise<Boolean>
  * @example
  * // false
  * await everySeries(async n => (n > 5), [4, 5, 6, 7]);
*/
export const everySeries = everyLimit(1);

/** Parallel some
  * @async
  * @func
  * @sig (a → Promise<Boolean>) → [a] → Promise<Boolean>
  * @example
  * // true
  * await some(async n => (n > 5), [4, 5, 6, 7]);
*/
export const some = someLimit(Infinity);

/** Serial some
  * @async
  * @func
  * @sig (a → Promise<Boolean>) → [a] → Promise<Boolean>
  * @example
  * // true
  * await someSeries(async n => (n > 5), [4, 5, 6, 7]);
*/
export const someSeries = someLimit(1);

/** Parallel find
  * @async
  * @func
  * @sig (a → Promise<Boolean>) → [a] → Promise<a>
  * @example
  * const records = [{ id: 1 }, { id: 2 }, { id: 3 }];
  *
  * // { id: 2 }
  * await find(async ({ id }) => (id === 2), records);
*/
export const find = findLimit(Infinity);

/** Serial find
  * @async
  * @func
  * @sig (a → Promise<Boolean>) → [a] → Promise<a>
  * @example
  * const records = [{ id: 1 }, { id: 2 }, { id: 3 }];
  *
  * // { id: 2 }
  * await findSeries(async ({ id }) => (id === 2), records);
*/
export const findSeries = findLimit(1);

/** Parallel flatMap (aka. "chain")
  * @async
  * @func
  * @sig (a → Promise<[b]>) → [a] → Promise<[b]>
  * @example
  * const array = [1, 2, 3];
  *
  * // [1, 2, 2, 4, 3, 6]
  * await flatMap(async n => [n, n * 2], array);
*/
export const flatMap = flatMapLimit(Infinity);

/** Serial flatMap (aka. "chain")
  * @async
  * @func
  * @sig (a → Promise<[b]>) → [a] → Promise<[b]>
  * @example
  * const array = [1, 2, 3];
  *
  * // [1, 2, 2, 4, 3, 6]
  * await flatMapSeries(async n => [n, n * 2], array);
*/
export const flatMapSeries = flatMapLimit(1);

/** Parallel filter
  * @async
  * @func
  * @sig (a → Promise<Boolean>) → [a] → Promise<[a]>
  * @example
  * const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  * // [0, 1, 2, 3, 4, 5]
  * await filter(async n => (n <= 5), array);
*/
export const filter = filterLimit(Infinity);

/** Serial filter
  * @async
  * @func
  * @sig (a → Promise<Boolean>) → [a] → Promise<[a]>
  * @example
  * const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  * // [0, 1, 2, 3, 4, 5]
  * await filterSeries(async n => (n <= 5), array);
*/
export const filterSeries = filterLimit(1);

/** Parallel all settled
  * @async
  * @func
  * @sig [Promise] → Promise<[{ status, value, reason }]>
*/
export const allSettled = allSettledLimit(Infinity);

/** Serial all settled
  * @async
  * @func
  * @sig [Promise] → Promise<[{ status, value, reason }]>
*/
export const allSettledSeries = allSettledLimit(1);

/** Parallel props
  * @async
  * @func
  * @sig { k: Promise<v> } → Promise<{ k: v }>
  * @example
  * // { one: 1, two: 2, three: 3 }
  * await props({
  *   one: Promise.resolve(1),
  *   two: 2,
  *   three: Promise.resolve(3),
  * });
*/
export const props = mapPairs(async ([key, val]) => [key, await val]);

/** Async R.evolve
  * @async
  * @func
  * @sig { k: (a → Promise<b>) } → { k: a } → Promise<{ k: b }>
  * @example
  * const data = { a: 1, b: 2, c: 3 };
  * // { a: 2, b: 4, c: 3 }
  * await evolve({
  *   a: async a => a + 1,
  *   b: async b => b * 2,
  * }, data);
*/
export const evolve = pipeC(R.evolve, props);

/** Timeout a promise
  * @async
  * @func
  * @sig Number → Promise<a> → Promise<a>
  * @example
  * await timeout(2000, delay(100)); // undefined
  * await timeout(100, delay(2000)); // TimeoutError
*/
export const timeout = R.curry((ms, promise) => race([
  promise,
  delay(ms).then(() => {
    throw new TimeoutError(`Promise timed out after ${ ms }ms`);
  }),
]));
