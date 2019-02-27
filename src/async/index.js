// modules
import * as R from 'ramda';

// local
// import { map: mapIterable } from '../iterable/sync';
import { isObject, isIterator } from '../is';
import mapLimitCallback from './map-limit-cb';

// @async parallel resolve promises
export const all = Promise.all.bind(Promise);

// @async array<promise> -> *
export const race = Promise.race.bind(Promise);

// @async number -> undefined
export const delay = async ms => new Promise(res => setTimeout(res, ms));

// wraps a function to always return a promise
// (a -> b) -> (a -> b)
export const toAsync = func => async (...args) => func(...args);

// returns a promise that is resolved by an err-back function
export const fromCallback = async func => {
  return new Promise((resolve, reject) => {
    func((err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// make an errback-calling function promise-returning
// inverse of callbackify
export const promisify = func => async (...args) => {
  return fromCallback(cb => func(...args, cb));
};

// make a promise-returning function errback-yielding
// inverse of promisify
export const callbackify = func => (...args) => {
  const cb = args.pop();
  toAsync(func)(...args)
    .then(res => cb(null, res))
    .catch(err => cb(err));
};

// creates an externally controlled promise
// * -> object
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

// @async (series)
// ((a, t) -> a) -> a -> [t] -> a
export const reduce = R.curry(async (pred, init, iterable) => {
  let result = init;
  for (const el of iterable) result = await pred(result, el);
  return result;
});

// serial + async R.pipe
// works with sync or async functions
export const pipe = (fn, ...fns) => async (...args) => {
  return reduce(R.applyTo, await fn(...args), fns);
};
// curried async pipe
export const pipeC = (...funcs) => R.curryN(funcs[0].length, pipe(...funcs));

// @async
// number -> (a -> b) -> [a] -> [b]
// number -> (a -> b) -> { k: a } -> { k: b }
export const mapLimit = R.curry(async (limit, pred, iterable) => {
  if (isIterator(iterable)) iterable = [...iterable];
  
  let before = R.identity;
  let after = R.identity;
  let asyncPred = pred;
      
  if (isObject(iterable)) {
    before = R.toPairs;
    after = R.fromPairs;
    asyncPred = async item => {
      const res = await pred(item[1]);
      return [item[0], res];
    };
  }
  return promisify(mapLimitCallback)(
    before(iterable),
    limit,
    callbackify(asyncPred),
  ).then(after);
});

// number -> (v -> w) -> object<k,v> -> object<k,w>
export const mapPairsLimit = R.curry(async (limit, pred, object) => {
  return R.fromPairs(await mapLimit(limit, pred, R.toPairs(object)));
});

// number -> (a -> b) -> [a] -> [b]
export const forEachLimit = R.curry(async (limit, pred, iterable) => {
  await mapLimit(limit, pred, iterable);
  return iterable;
});

// number -> (a -> boolean) -> [a] -> boolean
export const everyLimit = R.curry(async (limit, pred, iterable) => {
  return new Promise(async resolve => {
    await forEachLimit(limit, async item => {
      if (!await pred(item)) resolve(false);
    }, iterable);
    resolve(true);
  });
});

// number -> (a -> boolean) -> [a] -> boolean
export const someLimit = R.curry(async (limit, pred, iterable) => {
  return new Promise(async resolve => {
    await forEachLimit(limit, async item => {
      if (await pred(item)) resolve(true);
    }, iterable);
    resolve(false);
  });
});

// @async (parallel)
// number -> (a -> boolean) -> [a]
export const findLimit = R.curry(async (limit, pred, iterable) => {
  return new Promise(async (resolve, reject) => {
    await forEachLimit(limit, async item => {
      if (await pred(item)) resolve(item);
    }, iterable)
      // resolve undefined if none found
      .then(() => resolve())
      .catch(reject);
  });
});

// number -> (a -> [a]) -> [a] -> [a]
export const flatMapLimit = pipeC(mapLimit, R.chain(R.identity));

// @async (parallel)
// number -> (a -> boolean) -> [a] -> [a]
export const filterLimit = R.curry(async (limit, pred, iterable) => {
  return flatMapLimit(limit, async item => {
    return await pred(item) ? [item] : [];
  }, iterable);
});

// @async (parallel)
// number -> [promise] -> [object]
export const allSettledLimit = R.curry((limit, promises) => {
  return mapLimit(limit, promise => {
    return Promise
      .resolve(promise)
      .then(value => ({ status: 'fulfilled', value }))
      .catch(reason => ({ status: 'rejected', reason }));
  }, promises);
});



// @async (parallel)
// Functor f => (a -> b) -> f a -> f b
export const map = mapLimit(Infinity);
// @async (series)
// predicate -> iterable -> iterable
export const mapSeries = mapLimit(1);


// @async (parallel)
// (v -> w) -> object<k,v> -> object<k,w>
export const mapPairs = mapPairsLimit(Infinity);
// @async (series)
// (v -> w) -> object<k,v> -> object<k,w>
export const mapPairsSeries = mapPairsLimit(1);


// @async (parallel)
// (a -> b) -> [a] -> [b]
export const forEach = forEachLimit(Infinity);
// @async (series)
// (a -> b) -> [a] -> [b]
export const forEachSeries = forEachLimit(1);


// @async (parallel)
// (a -> boolean) -> [a] -> boolean
export const every = everyLimit(Infinity);
// @async (series)
// (a -> boolean) -> [a] -> boolean
export const everySeries = everyLimit(1);


// @async (parallel)
// (a -> boolean) -> [a] -> boolean
export const some = someLimit(Infinity);
// @async (series)
// (a -> boolean) -> [a] -> boolean
export const someSeries = someLimit(1);


// @async (parallel)
// predicate -> iterable<a> -> a
export const find = findLimit(Infinity);
// @async (series)
// predicate -> iterable<a> -> a
export const findSeries = findLimit(1);


// @async (parallel)
// (a -> [a]) -> [a] -> [a]
export const flatMap = flatMapLimit(Infinity);
// @async (series)
// (a -> [a]) -> [a] -> [a]
export const flatMapSeries = flatMapLimit(1);


// @async (parallel)
// (a -> boolean) -> [a] -> [a]
export const filter = filterLimit(Infinity);
// @async (series)
// (a -> boolean) -> [a] -> [a]
export const filterSeries = filterLimit(1);


// @async array<promise> -> array<object>
export const allSettled = allSettledLimit(Infinity);

// @async array<promise> -> array<object>
export const allSettledSeries = allSettledLimit(1);


// @async (parallel)
// object -> object
export const props = mapPairs(async ([key, val]) => [key, await val]);

// timeout a promise. timeout throws TimeoutError
export class TimeoutError extends Error {}
// number -> promise -> promise
export const timeout = R.curry((ms, promise) => race([
  promise,
  delay(ms).then(() => {
    throw new TimeoutError(`Promise timed out after ${ ms }ms`);
  }),
]));
