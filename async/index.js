'use strict';

// modules
const R = require('ramda');

// local
// const { map: mapIterable } = require('../iterable/sync');
const { isObject, isIterator } = require('../is');
const mapLimitCallback = require('./map-limit-cb');

// @async parallel resolve promises
const all = Promise.all.bind(Promise);

// @async array<promise> -> *
const race = Promise.race.bind(Promise);

// @async number -> undefined
const delay = async ms => new Promise(res => setTimeout(res, ms));

// wraps a function to always return a promise
// (a -> b) -> (a -> b)
const toAsync = func => async (...args) => func(...args);

// returns a promise that is resolved by an err-back function
const fromCallback = async func => {
  return new Promise((resolve, reject) => {
    func((err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// make an errback-calling function promise-returning
// inverse of callbackify
const promisify = func => async (...args) => {
  return fromCallback((cb) => func(...args, cb));
};

// make a promise-returning function errback-yielding
// inverse of promisify
const callbackify = func => (...args) => {
  const cb = args.pop();
  toAsync(func)(...args)
    .then((res) => cb(null, res))
    .catch((err) => cb(err));
};

// creates an externally controlled promise
// * -> object
const deferred = () => {
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
const reduce = R.curry(async (pred, init, iterable) => {
  let result = init;
  for (const el of iterable) result = await pred(result, el);
  return result;
});

// serial + async R.pipe
// works with sync or async functions
const pipe = (fn, ...fns) => async (...args) => {
  return reduce(R.applyTo, await fn(...args), fns);
};
// curried async pipe
const pipeC = (...funcs) => R.curryN(funcs[0].length, pipe(...funcs));

// @async
// number -> (a -> b) -> [a] -> [b]
// number -> (a -> b) -> { k: a } -> { k: b }
const mapLimit = R.curry(async (limit, pred, iterable) => {
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
const mapPairsLimit = R.curry(async (limit, pred, object) => {
  return R.fromPairs(await mapLimit(limit, pred, R.toPairs(object)));
});

// number -> (a -> b) -> [a] -> [b]
const forEachLimit = R.curry(async (limit, pred, iterable) => {
  await mapLimit(limit, pred, iterable);
  return iterable;
});

// number -> (a -> boolean) -> [a] -> boolean
const everyLimit = R.curry(async (limit, pred, iterable) => {
  return new Promise(async (resolve) => {
    await forEachLimit(limit, async (item) => {
      if (!await pred(item)) resolve(false);
    }, iterable);
    resolve(true);
  });
});

// number -> (a -> boolean) -> [a] -> boolean
const someLimit = R.curry(async (limit, pred, iterable) => {
  return new Promise(async (resolve) => {
    await forEachLimit(limit, async (item) => {
      if (await pred(item)) resolve(true);
    }, iterable);
    resolve(false);
  });
});

// @async (parallel)
// number -> (a -> boolean) -> [a]
const findLimit = R.curry(async (limit, pred, iterable) => {
  return new Promise(async (resolve, reject) => {
    await forEachLimit(limit, async (item) => {
      if (await pred(item)) resolve(item);
    }, iterable)
      // resolve undefined if none found
      .then(() => resolve())
      .catch(reject);
  });
});

// number -> (a -> [a]) -> [a] -> [a]
const flatMapLimit = pipeC(mapLimit, R.chain(R.identity));

// @async (parallel)
// number -> (a -> boolean) -> [a] -> [a]
const filterLimit = R.curry(async (limit, pred, iterable) => {
  return flatMapLimit(limit, async (item) => {
    return await pred(item) ? [item] : [];
  }, iterable);
});

// @async (parallel)
// number -> [promise] -> [object]
const allSettledLimit = R.curry((limit, promises) => {
  return mapLimit(limit, promise => {
    return Promise
      .resolve(promise)
      .then(value => ({ status: 'fulfilled', value }))
      .catch(reason => ({ status: 'rejected', reason }));
  }, promises);
});



// @async (parallel)
// Functor f => (a -> b) -> f a -> f b
const map = mapLimit(Infinity);
// @async (series)
// predicate -> iterable -> iterable
const mapSeries = mapLimit(1);


// @async (parallel)
// (v -> w) -> object<k,v> -> object<k,w>
const mapPairs = mapPairsLimit(Infinity);
// @async (series)
// (v -> w) -> object<k,v> -> object<k,w>
const mapPairsSeries = mapPairsLimit(1);


// @async (parallel)
// (a -> b) -> [a] -> [b]
const forEach = forEachLimit(Infinity);
// @async (series)
// (a -> b) -> [a] -> [b]
const forEachSeries = forEachLimit(1);


// @async (parallel)
// (a -> boolean) -> [a] -> boolean
const every = everyLimit(Infinity);
// @async (series)
// (a -> boolean) -> [a] -> boolean
const everySeries = everyLimit(1);


// @async (parallel)
// (a -> boolean) -> [a] -> boolean
const some = someLimit(Infinity);
// @async (series)
// (a -> boolean) -> [a] -> boolean
const someSeries = someLimit(1);


// @async (parallel)
// predicate -> iterable<a> -> a
const find = findLimit(Infinity);
// @async (series)
// predicate -> iterable<a> -> a
const findSeries = findLimit(1);


// @async (parallel)
// (a -> [a]) -> [a] -> [a]
const flatMap = flatMapLimit(Infinity);
// @async (series)
// (a -> [a]) -> [a] -> [a]
const flatMapSeries = flatMapLimit(1);


// @async (parallel)
// (a -> boolean) -> [a] -> [a]
const filter = filterLimit(Infinity);
// @async (series)
// (a -> boolean) -> [a] -> [a]
const filterSeries = filterLimit(1);


// @async array<promise> -> array<object>
const allSettled = allSettledLimit(Infinity);

// @async array<promise> -> array<object>
const allSettledSeries = allSettledLimit(1);


// @async (parallel)
// object -> object
const props = mapPairs(async ([key, val]) => [key, await val]);

// timeout a promise. timeout throws TimeoutError
class TimeoutError extends Error {}
// number -> promise -> promise
const timeout = R.curry((ms, promise) => race([
  promise,
  delay(ms).then(() => {
    throw new TimeoutError(`Promise timed out after ${ ms }ms`);
  }),
]));

module.exports = {
  all,
  allSettled,
  allSettledLimit,
  allSettledSeries,
  callbackify,
  deferred,
  delay,
  every,
  everyLimit,
  everySeries,
  filter,
  filterLimit,
  filterSeries,
  find,
  findLimit,
  findSeries,
  flatMap,
  flatMapLimit,
  flatMapSeries,
  forEach,
  forEachLimit,
  forEachSeries,
  fromCallback,
  map,
  mapLimit,
  mapPairs,
  mapPairsLimit,
  mapPairsSeries,
  mapSeries,
  pipe,
  pipeC,
  promisify,
  props,
  race,
  reduce,
  some,
  someLimit,
  someSeries,
  timeout,
  TimeoutError,
  toAsync,
};
