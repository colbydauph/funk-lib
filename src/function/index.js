import { curry, curryN, pipe } from 'ramda';


// curried pipe
export const pipeC = (...funcs) => curryN(funcs[0].length, pipe(...funcs));

// (b -> b -> c) -> (a -> b) -> a -> a -> c
export const on = curry((bi, un, xa, ya) => bi(un(xa), un(ya)));

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
