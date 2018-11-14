'use strict';

// core
const util = require('util');

// modules
const R = require('ramda');

// local
const { random } = require('../number');

// todo: rename to index
// Array<V> -> Object<K, V>
const toObj = R.pipe(R.toPairs, R.fromPairs);

// @deprecated
// (A -> B) -> Array<A> -> Object<B, A>
const toObjBy = R.curryN(2)(util.deprecate(
  R.indexBy,
  'funk-lib/object/toObjBy -> R.indexBy'
));

// select a random array item
// Array<T> -> T
const sample = (arr) => arr[random(0, arr.length - 1)];

// todo
// Array<T> -> Array<T>
// const shuffle = (arr) => {};

module.exports = {
  sample,
  toObj,
  toObjBy,
};
