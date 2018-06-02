'use strict';

const R = require('ramda');

// (A -> B) -> Array<A> -> Object<B, A>
const toObjWith = R.curry((pred, arr) => {
  return R.fromPairs(R.map((el) => [pred(el), el], arr));
});

// select a random array item
// Array<A> -> A
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

module.exports = {
  sample,
  toObjWith,
};
