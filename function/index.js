'use strict';

const R = require('ramda');

// curried R.pipe
const pipeC = (...funcs) => R.curryN(funcs[0].length, R.pipe(...funcs));

// (b -> b -> c) -> (a -> b) -> a -> a -> c
const on = R.curry((bi, un, xa, ya) => bi(un(xa), un(ya)));

// (a -> b) -> (a -> b)
const once = fn => {
  let called = false;
  let res;
  
  return (...args) => {
    if (called) return res;
    res = fn(...args);
    called = true;
    return res;
  };
};

// "no-op"
const noop = () => {};

module.exports = {
  noop,
  on,
  once,
  pipeC,
};
