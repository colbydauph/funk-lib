'use strict';

// core
const util = require('util');

// modules
const R = require('ramda');

// local
const { random } = require('../number');

// Array<A> -> Object<K, A>
const toObj = R.pipe(R.toPairs, R.fromPairs);

// @deprecated
const toObjBy = R.curryN(2)(util.deprecate(
  R.indexBy,
  'funk-lib/object/toObjBy is deprecated. use R.indexBy instead'
));

// select a random array item
// Array<A> -> A
const sample = (arr) => arr[random(0, arr.length - 1)];

module.exports = {
  sample,
  toObj,
  toObjBy,
};
