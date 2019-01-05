'use strict';

const R = require('ramda');

// curried R.pipe
const pipeC = (...funcs) => R.curryN(funcs[0].length, R.pipe(...funcs));

// (b -> b -> c) -> (a -> b) -> a -> a -> c
const on = R.curry((bi, un, xa, ya) => bi(un(xa), un(ya)));

const noop = () => {};

module.exports = {
  noop,
  on,
  pipeC,
};
