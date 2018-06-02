'use strict';

// modules
const R = require('ramda');

// @async number -> undefined
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// wraps a function to always return a promise
const toAsync = (func) => async (...args) => func(...args);

// inverse of callbackify
const promisify = (func) => (...args) => {
  return new Promise((resolve, reject) => {
    func(...args, (err, data) => {
      // eslint-disable-next-line no-unused-expressions
      err ? reject(err) : resolve(data);
    });
  });
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

// @async (parallel)
// predicate -> iterable -> iterable
const flatMap = R.curry(async (pred, iterable) => {
  const arrs = await map(pred, iterable);
  return R.chain(R.identity, arrs);
});

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
  delay,
  filter,
  flatMap,
  forEach,
  map,
  promisify,
  props,
  reduce,
  toAsync,
};
