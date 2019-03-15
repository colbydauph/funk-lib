import { curry, curryN, pipe } from 'ramda';


/** curried pipe
  * @func
  * @sig ...f -> f
*/
export const pipeC = (...funcs) => curryN(funcs[0].length, pipe(...funcs));

/** on
  * @func
  * @sig (b -> b -> c) -> (a -> b) -> a -> a -> c
  * @example
  * const records = [{ age: 9 }, { age: 1 }, { age: 3 }];
  *
  * // [{ age: 1 }, { age: 3 }, { age: 9 }]
  * R.sort(on(R.subtract, R.prop('age'))), records);
*/
export const on = curry((bi, un, xa, ya) => bi(un(xa), un(ya)));

/** once
  * @func
  * @sig (a -> b) -> (a -> b)
*/
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

/** "no-op"
  * @func
  * @sig * -> undefined
*/
export const noop = () => {};
