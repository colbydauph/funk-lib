'use strict';

// modules
const R = require('ramda');

// local
const { map: mapIterable } = require('../iterable/sync');
const { isObject, isIterable } = require('../is');

// @async parallel resolve promises
const all = Promise.all.bind(Promise);

// @async array<promise> -> *
const race = Promise.race.bind(Promise);

// @async number -> undefined
const delay = async (ms) => new Promise((res) => setTimeout(res, ms));

// wraps a function to always return a promise
// (* -> *) -> * -> *
const toAsync = (func) => async (...args) => func(...args);

// returns a promise that is resolved by an err-back function
const fromCallback = async (func) => {
  return new Promise((resolve, reject) => {
    func((err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// make an errback-calling function promise-returning
// inverse of callbackify
const promisify = (func) => async (...args) => {
  return fromCallback((cb) => func(...args, cb));
};

// make a promise-returning function errback-yielding
// inverse of promisify
const callbackify = (func) => (...args) => {
  const cb = args.pop();
  toAsync(func)(...args)
    .then((res) => cb(null, res))
    .catch((err) => cb(err));
};

// creates an externally controlled promise
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
// predicate -> * -> iterable -> iterable
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

// @async (parallel)
// (v -> w) -> object<k,v> -> object<k,w>
const mapPairs = R.curry(async (pred, object) => {
  return R.fromPairs(await all(mapIterable(pred, R.toPairs(object))));
});

// @async (parallel)
// object -> object
const props = mapPairs(async ([key, val]) => [key, await val]);

// @async (parallel)
// Functor f => (a -> b) -> f a -> f b
const map = R.curry(async (pred, iterable) => {
  if (isIterable(iterable)) return all(mapIterable(pred, iterable));
  if (isObject(iterable)) return props(R.map(pred, iterable));
  // todo: support other mapables here
  throw Error(`unable to map ${ iterable }`);
});

// @async (series)
// predicate -> iterable -> iterable
const mapSeries = R.curry(async (pred, iterable) => {
  return reduce(async (out, item) => {
    return [...out, await pred(item)];
  }, [], iterable);
});

// @async (parallel)
// predicate -> iterable -> iterable
const forEach = R.curry(async (pred, iterable) => {
  await map(pred, iterable);
  return iterable;
});

// @async (series)
// predicate -> iterable -> iterable
const forEachSeries = R.curry(async (pred, iterable) => {
  // ignore output values
  await mapSeries(pred, iterable);
  return iterable;
});

// @async (parallel)
// predicate -> iterable -> iterable
const every = R.curry(async (pred, iterable) => {
  return new Promise(async (resolve) => {
    await forEach(async (item) => {
      if (!await pred(item)) resolve(false);
    }, iterable);
    resolve(true);
  });
});

// @async (series)
// predicate -> iterable -> iterable
const everySeries = R.curry(async (pred, iterable) => {
  for (const item of iterable) {
    // eagerly return
    if (!await pred(item)) return false;
  }
  return true;
});

// @async (parallel)
// predicate -> iterable<a> -> a
const find = R.curry(async (pred, iterable) => {
  return new Promise(async (resolve, reject) => {
    await forEach(async (item) => {
      if (await pred(item)) resolve(item);
    }, iterable)
      // resolve undefined if none found
      .then(() => resolve())
      .catch(reject);
  });
});

// @async (series)
// predicate -> iterable<a> -> a
const findSeries = R.curry(async (pred, iterable) => {
  for (const item of iterable) {
    if (await pred(item)) return item;
  }
});


// @async (parallel)
// predicate -> iterable -> iterable
const flatMap = pipeC(map, R.chain(R.identity));

// @async (series)
// predicate -> iterable -> iterable
const flatMapSeries = pipeC(mapSeries, R.chain(R.identity));

// @async (parallel)
// predicate -> iterable -> iterable
const filter = R.curry(async (pred, iterable) => {
  return flatMap(async (item) => {
    return await pred(item) ? [item] : [];
  }, iterable);
});

// @async (series)
// predicate -> iterable -> iterable
const filterSeries = R.curry(async (pred, iterable) => {
  return flatMapSeries(async (item) => {
    return await pred(item) ? [item] : [];
  }, iterable);
});

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
  callbackify,
  deferred,
  delay,
  every,
  everySeries,
  filter,
  filterSeries,
  find,
  findSeries,
  flatMap,
  flatMapSeries,
  forEach,
  forEachSeries,
  fromCallback,
  map,
  mapPairs,
  mapSeries,
  pipe,
  pipeC,
  promisify,
  props,
  race,
  reduce,
  timeout,
  TimeoutError,
  toAsync,
};
