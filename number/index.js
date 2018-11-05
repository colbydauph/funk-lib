'use strict';

const R = require('ramda');

// inclusive bounds
// int -> int -> int
const random = R.useWith((min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}, [
  R.max(Number.MIN_SAFE_INTEGER),
  R.min(Number.MAX_SAFE_INTEGER),
]);



module.exports = {
  random,
};
