import { curry, curryN, pipe } from 'ramda';


/** Curried pipe
  * @func
  * @sig ...f → f
  * @example
  * const math = pipeC(
  *   (a, b) => a + b,
  *   c => (c * 2),
  *   c => (c + 1),
  * );
  * math(2)(5) // 21;
*/
export const pipeC = (...funcs) => curryN(funcs[0].length, pipe(...funcs));

/** Y combinator. Define recursive functions without variable assignment.
  * @func
  * @sig ((a → b) → (a → b)) → (a → b)
  * @example
  * const fib = Y(f => n => {
  *   return (n <= 2) ? 1 : f(n - 1) + f(n - 2);
  * });
  * fib(7); // 13
*/
// eslint-disable-next-line id-length
export const Y = f => (g => g(g))(g => f(x => g(g)(x)));

/** Transforms two inputs and combines the outputs
  * @func
  * @sig (b → b → c) → (a → b) → a → a → c
  * @example
  * const records = [{ age: 9 }, { age: 1 }, { age: 3 }];
  *
  * // [{ age: 1 }, { age: 3 }, { age: 9 }]
  * R.sort(on(R.subtract, R.prop('age'))), records);
*/
export const on = curry((bi, un, xa, ya) => bi(un(xa), un(ya)));

/** Creates a function that is restricted to invoking func once.
  * Repeat calls to the function return the value of the first invocation
  * @func
  * @sig (a → b) → (a → b)
  * @example
  * const pred = n => n > 5;
  * const oncePred = once(pred);
  * oncePred(10); // true
  * oncePred(1); // true (cached. pred not called again)
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

/** A function that does nothing. "no-op"
  * @func
  * @sig a → undefined
  * @example noop(); // undefined
*/
export const noop = () => {};

/** Wraps a function so that it is only invoked at most once every `delay` ms
  * @func
  * @sig Number → (a → b) → (a → b)
  * @example
  * const throttled = throttle(100, expensiveMath);
  * throttled(1, 2);
*/
export const throttle = curry((delay, fn) => {
  let lastCall = 0;
  return (...args) => {
    const now = (new Date()).getTime();
    if ((now - lastCall) < delay) return;
    lastCall = now;
    return fn(...args);
  };
});

/** Wrap a function to delay invocation until after `delay` ms
  * have elapsed since the last call
  * @func
  * @sig Number → (a → b) → (a → undefined)
  * @example
  * const debounce = debounce(100, expensiveMath);
  * debounced(1, 2);
*/
export const debounce = curry((delay, fn) => {
  let timeoutID;
  return (...args) => {
    if (timeoutID) clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      fn(...args);
      timeoutID = null;
    }, delay);
  };
});
