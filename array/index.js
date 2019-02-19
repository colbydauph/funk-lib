'use strict';

// core
const util = require('util');

// modules
const R = require('ramda');

// local
const { random } = require('../number');

// todo: rename to index
// [v] -> object<k, v>
const toObj = R.pipe(R.toPairs, R.fromPairs);

// @deprecated
// (a -> b) -> [a] -> object<b, a>
const toObjBy = R.curryN(2)(util.deprecate(
  R.indexBy,
  'funk-lib/object/toObjBy -> R.indexBy'
));

// select a random array item
// [t] -> t
const sample = arr => arr[random(0, arr.length - 1)];

// immutably randomize array element order
// Fisher-Yates shuffle
// [t] -> [t]
const shuffle = (arr) => {
  arr = [...arr];
  
  // eslint-disable-next-line id-length
  let j, x, i;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
};

module.exports = {
  sample,
  shuffle,
  toObj,
  toObjBy,
};
