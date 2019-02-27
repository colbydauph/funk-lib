import * as R from 'ramda';

// curried R.pipe
export const pipeC = (...funcs) => R.curryN(funcs[0].length, R.pipe(...funcs));

// (b -> b -> c) -> (a -> b) -> a -> a -> c
export const on = R.curry((bi, un, xa, ya) => bi(un(xa), un(ya)));

// (a -> b) -> (a -> b)
export const once = fn => {
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
export const noop = () => {};
