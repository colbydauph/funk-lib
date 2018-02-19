'use strict';

// modules
const R = require('ramda');

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
  return [].concat(...arrs);
});

// @async (series)
// predicate -> * -> iterable -> iterable
const reduce = R.curry(async (pred, init, iterable) => {
  let result = init;
  for (const el of iterable) result = await pred(result, el);
  return result;
});

module.exports = {
  filter,
  flatMap,
  forEach,
  map,
  reduce,
};
