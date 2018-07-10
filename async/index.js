'use strict';

// modules
const R = require('ramda');

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

// inverse of callbackify
const promisify = (func) => async (...args) => {
  return fromCallback((cb) => func(...args, cb));
};

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

// @async (parallel)
// predicate -> iterable -> iterable
const forEach = R.curry(async (pred, iterable) => {
  await Promise.all(iterable.map((item) => pred(item)));
  return iterable;
});

// @async (parallel)
// predicate -> iterable -> iterable
const map = R.curry(async (pred, iterable) => {
  return Promise.all(iterable.map((item) => pred(item)));
});

// @async (parallel)
// predicate -> iterable -> iterable
const filter = R.curry(async (pred, iterable) => {
  const bools = await map(pred, iterable);
  return iterable.filter((el, i) => bools[i]);
});

// serial + async R.pipe
const pipe = (...funcs) => async (...args) => {
  for (const func of funcs) args = [await func(...args)];
  return args[0];
};

// @async (parallel)
// predicate -> iterable -> iterable
const flatMap = R.curryN(2)(pipe(map, R.chain(R.identity)));

// @async (series)
// predicate -> * -> iterable -> iterable
const reduce = R.curry(async (pred, init, iterable) => {
  let result = init;
  for (const el of iterable) result = await pred(result, el);
  return result;
});

// @async (parallel)
// object -> object
const props = async (obj) => {
  const out = await map(async ([key, promise]) => {
    return [key, await promise];
  }, R.toPairs(obj));
  return R.fromPairs(out);
};

module.exports = {
  callbackify,
  deferred,
  delay,
  filter,
  flatMap,
  forEach,
  fromCallback,
  map,
  pipe,
  promisify,
  props,
  reduce,
  toAsync,
};
