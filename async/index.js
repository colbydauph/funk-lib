'use strict';

// modules
const R = require('ramda');

// @async array<promise> -> *
const race = Promise.race.bind(Promise);

// @async number -> undefined
const delay = async (ms) => new Promise((res) => setTimeout(res, ms));

// wraps a function to always return a promise
const toAsync = (func) => async (...args) => func(...args);

const fromCallback = async (func) => {
  return new Promise((resolve, reject) => {
    func((err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// make an errback-yielding function promise-returning
// inverse of callbackify
const promisify = (func) => async (...args) => {
  return fromCallback((cb) => func(...args, cb));
};

// make a promise-returning function errback-yielding
// inverse of promisify
const callbackify = (func) => (...args) => {
  const cb = args.pop();
  Promise
    .resolve(args)
    .then((args) => func(...args))
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

// @async (parallel)
// predicate -> iterable -> iterable
const map = R.curry(async (pred, iterable) => {
  return Promise.all(iterable.map((item) => pred(item)));
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
  await mapSeries(pred, iterable);
  return iterable;
});

// fixme: do this in O(n)
// @async (parallel)
// predicate -> iterable -> iterable
const filter = R.curry(async (pred, iterable) => {
  const bools = await map(pred, iterable);
  return iterable.filter((el, i) => bools[i]);
});

// fixme: do this in O(n)
// @async (series)
// predicate -> iterable -> iterable
const filterSeries = R.curry(async (pred, iterable) => {
  const bools = await mapSeries(pred, iterable);
  return iterable.filter((el, i) => bools[i]);
});

// serial + async R.pipe
// works with sync or async functions
const pipe = (fn, ...fns) => async (...args) => {
  return reduce(R.applyTo, await fn(...args), fns);
};

// @async (parallel)
// predicate -> iterable -> iterable
const flatMap = R.curryN(2, pipe(map, R.chain(R.identity)));

// @async (parallel)
// object -> object
const props = pipe(
  R.toPairs,
  map(async ([key, val]) => [key, await val]),
  R.fromPairs,
);

// timeout a promise. timeout throws TimeoutError
class TimeoutError extends Error {}
// number -> promise -> promise
const timeout = R.curry((ms, promise) => race([
  promise,
  delay(ms).then(() => {
    throw new TimeoutError(`timed out after ${ ms }ms`);
  }),
]));

module.exports = {
  callbackify,
  deferred,
  delay,
  filter,
  filterSeries,
  flatMap,
  forEach,
  forEachSeries,
  fromCallback,
  map,
  mapSeries,
  pipe,
  promisify,
  props,
  race,
  reduce,
  timeout,
  TimeoutError,
  toAsync,
};
