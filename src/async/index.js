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
  * @sig [Promise<a>] -> [a]
*/
export const all = Promise.all.bind(Promise);

/** Race
  * @async
  * @func
  * @sig [Promise<a>] -> a
*/
export const race = Promise.race.bind(Promise);

/** Promise returning setTimeout
  * @async
  * @func
  * @sig Number -> undefined
  * @example await delay(100) // resolved in 100ms
*/
export const delay = async ms => new Promise(res => setTimeout(res, ms));

/** wraps a function to always return a promise
  * @async
  * @func
  * @sig (a -> b) -> (a -> Promise<b>)
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

// make a promise-returning function errback-yielding
// inverse of promisify
export const callbackify = f => (...args) => {
  const cb = args.pop();
  toAsync(f)(...args)
    .then(res => cb(null, res))
    .catch(err => cb(err));
};

/** creates an externally controlled promise
  * @async
  * @func
  * @sig * -> Object
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
  * @sig ((a, b) -> Promise<a>) -> a -> [b] -> Promise<a>
*/
export const reduce = R.curry(async (f, acc, xs) => {
  for (const x of xs) acc = await f(acc, x);
  return acc;
});

/** serial + async R.pipe. works with sync or async functions
  * @async
  * @func
  * @sig (...f) -> f
*/
export const pipe = (f, ...fs) => async (...args) => {
  return reduce(R.applyTo, await f(...args), fs);
};

/** Curried async pipe
  * @async
  * @func
  * @sig (...f) -> f
*/
export const pipeC = (...f) => R.curryN(f[0].length, pipe(...f));

/** Map with variable parallelization
  * @async
  * @func
  * @sig Number -> (a -> Promise<b>) -> [a] -> Promise<[b]>
  * @example
  * // [2, 4, 6, 8, 10]
  * await mapLimit(2, async n => n * 2, [1, 2, 3, 4, 5]);
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

/** Map pairs with variable parallelization
  * @async
  * @func
  * @sig Number -> ([a, b] -> Promise<[c, d]>) -> { a: b } -> Promise<{ c: d }>
*/
export const mapPairsLimit = R.curry(async (limit, f, object) => {
  return R.fromPairs(await mapLimit(limit, f, R.toPairs(object)));
});

/** For each with variable parallelization
  * @async
  * @func
  * @sig Number -> (a -> Promise<b>) -> [a] -> Promise<[a]>
*/
export const forEachLimit = R.curry(async (limit, f, xs) => {
  await mapLimit(limit, f, xs);
  return xs;
});

/** Every with variable parallelization
  * @async
  * @func
  * @sig Number -> (a -> Promise<Boolean>) -> [a] -> Promise<Boolean>
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
  * @sig Number -> (a -> Promise<Boolean>) -> [a] -> Promise<Boolean>
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
  * @sig Number -> (a -> Promise<Boolean>) -> [a] -> Promise<a>
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
  * @sig Number -> (a -> Promise<[b]>) -> [a] -> Promise<[b]>
  * @example
  * const array = [1, 2, 3];
  *
  * // [1, 2, 2, 4, 3, 6]
  * await flatMapLimit(2, async n => [n, n * 2], array);
*/
export const flatMapLimit = pipeC(mapLimit, R.chain(R.identity));

/** Filter with variable parallelization
  * @async
  * @func
  * @sig Number -> (a -> Promise<Boolean>) -> [a] -> Promise<[a]>
*/
export const filterLimit = R.curry(async (limit, f, xs) => {
  return flatMapLimit(limit, async x => (await f(x) ? [x] : []), xs);
});

/** All settled with variable parallelization
  * @async
  * @func
  * @sig Number -> [Promise] -> Promise<[{ status, value, reason }]>
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
  * @sig (a -> Promise<b>) -> [a] -> Promise<[b]>
*/
export const map = mapLimit(Infinity);

/** Serial map
  * @async
  * @func
  * @sig (a -> Promise<b>) -> [a] -> Promise<[b]>
*/
export const mapSeries = mapLimit(1);

/** Parallel map pairs
  * @async
  * @func
  * @sig ([a, b] -> Promise<[c, d]>) -> { a: b } -> Promise<{ c: d }>
*/
export const mapPairs = mapPairsLimit(Infinity);

/** Serial map pairs
  * @async
  * @func
  * @sig ([a, b] -> Promise<[c, d]>) -> { a: b } -> Promise<{ c: d }>
*/
export const mapPairsSeries = mapPairsLimit(1);

/** Parallel for each
  * @async
  * @func
  * @sig (a -> Promise<b>) -> [a] -> Promise<[a]>
*/
export const forEach = forEachLimit(Infinity);

/** Serial for each
  * @async
  * @func
  * @sig (a -> Promise<b>) -> [a] -> Promise<[a]>
*/
export const forEachSeries = forEachLimit(1);

/** Parallel every
  * @async
  * @func
  * @sig (a -> Promise<Boolean>) -> [a] -> Promise<Boolean>
*/
export const every = everyLimit(Infinity);

/** Serial every
  * @async
  * @func
  * @sig (a -> Promise<Boolean>) -> [a] -> Promise<Boolean>
*/
export const everySeries = everyLimit(1);

/** Parallel some
  * @async
  * @func
  * @sig (a -> Promise<Boolean>) -> [a] -> Promise<Boolean>
*/
export const some = someLimit(Infinity);

/** Serial some
  * @async
  * @func
  * @sig (a -> Promise<Boolean>) -> [a] -> Promise<Boolean>
*/
export const someSeries = someLimit(1);

/** Parallel find
  * @async
  * @func
  * @sig (a -> Promise<Boolean>) -> [a] -> Promise<a>
*/
export const find = findLimit(Infinity);

/** Serial find
  * @async
  * @func
  * @sig (a -> Promise<Boolean>) -> [a] -> Promise<a>
*/
export const findSeries = findLimit(1);

/** Parallel flatMap (aka. "chain")
  * @async
  * @func
  * @sig (a -> Promise<[b]>) -> [a] -> Promise<[b]>
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
  * @sig (a -> Promise<[b]>) -> [a] -> Promise<[b]>
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
  * @sig (a -> Promise<Boolean>) -> [a] -> Promise<[a]>
  * @example
  * const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  * // [0, 1, 2, 3, 4, 5]
  * await filter(async n => (n <= 5), array);
*/
export const filter = filterLimit(Infinity);

/** Serial filter
  * @async
  * @func
  * @sig (a -> Promise<Boolean>) -> [a] -> Promise<[a]>
  * @example
  * const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  * // [0, 1, 2, 3, 4, 5]
  * await filterSeries(async n => (n <= 5), array);
*/
export const filterSeries = filterLimit(1);

/** Parallel all settled
  * @async
  * @func
  * @sig [Promise] -> Promise<[{ status, value, reason }]>
*/
export const allSettled = allSettledLimit(Infinity);

/** Serial all settled
  * @async
  * @func
  * @sig [Promise] -> Promise<[{ status, value, reason }]>
*/
export const allSettledSeries = allSettledLimit(1);

/** Parallel props
  * @async
  * @func
  * @sig { k: Promise<v> } -> Promise<{ k: v }>
  * @example
  * // { one: 1, two: 2 }
  * await props({
  *  one: Promise.resolve(1),
  *  two: Promise.resolve(2),
  * })
*/
export const props = mapPairs(async ([key, val]) => [key, await val]);

/** Async R.evolve
  * @async
  * @func
  * @sig { k: (a -> Promise<b>) } -> { k: a } -> Promise<{ k: b }>
*/
export const evolve = pipeC(R.evolve, props);

/** Timeout a promise
  * @async
  * @func
  * @sig Number -> Promise<a> -> Promise<a>
*/
export const timeout = R.curry((ms, promise) => race([
  promise,
  delay(ms).then(() => {
    throw new TimeoutError(`Promise timed out after ${ ms }ms`);
  }),
]));
