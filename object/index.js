'use strict';

// modules
const R = require('ramda');

// todo: pickAsDeep (recursive)

const firstKey = (obj) => Object.keys(obj)[0];
const firstPair = (obj) => Object.entries(obj)[0];
const firstValue = (obj) => Object.values(obj)[0];

// pick the keys from the first argument, renaming by the values in the second arg
// pickAs({ a: 'b', b: 'a' }, { a: 1, b: 2 }) === { a: 2, b: 1 }
// object -> object -> object
const pickAs = R.curry((keyVals, obj) => {
  return R.toPairs(keyVals).reduce((result, [key, val]) => {
    return R.assoc(val, obj[key], result);
  }, {});
});

// ([K, V] -> [L, M]) -> Object<K, V> -> Object<L, M>
const mapPairs = R.curry((pred, obj) => {
  const pairs = R
    .toPairs(obj)
    .map(pred);
  return R.fromPairs(pairs);
});

// (K -> M) -> Object<K, V> -> Object<M, V>
const mapKeys = R.curry((pred, obj) => {
  return mapPairs(([key, value]) => [pred(key), value], obj);
});

// (V -> M) -> Object<K, V> -> Object<K, M>
const mapValues = R.curry((pred, obj) => {
  return mapPairs(([key, value]) => [key, pred(value)], obj);
});

// recursive + mutating + identity
const deepFreeze = (obj) => {
  Object.freeze(obj);
  R.forEach(deepFreeze, R.values(obj));
  return obj;
};

// // recursive R.merge with predicate for custom merging
// const mergeDeepWith = R.curry((pred, left, right) => {
//   return R.mergeWith((left, right) => {
//     if (isObject(left) && isObject(right)) return mergeDeepWith(pred, left, right);
//     return pred(left, right);
//   }, left, right);
// });


module.exports = {
  deepFreeze,
  mapKeys,
  mapPairs,
  mapValues,
  pickAs,
  firstKey,
  firstValue,
  firstPair,
};
