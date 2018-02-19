'use strict';

// modules
const R = require('ramda');

// todo: pickAsDeep (recursive)

// picks values out of an object, whilst renaming their keys in result
// pickAs({ a: 'b', b: 'a' }, { a: 1, b: 2, c: 3 }) === { a: 2, b: 1 }
// object -> object -> object
const pickAs = R.curry((keyVals, obj) => {
  return R.toPairs(keyVals).reduce((result, [key, val]) => {
    return R.assoc(val, obj[key], result);
  }, {});
});

const mapPairs = R.curry((pred, obj) => {
  const pairs = R
    .toPairs(obj)
    .map(pred);
  return R.fromPairs(pairs);
});

const mapKeys = R.curry((pred, obj) => {
  return mapPairs(([key, value]) => [pred(key), value], obj);
});

const mapValues = R.curry((pred, obj) => {
  return mapPairs(([key, value]) => [key, pred(value)], obj);
});


module.exports = {
  mapKeys,
  mapPairs,
  mapValues,
  pickAs,
};
