// modules
import * as R from 'ramda';

/** Create coroutines with custom behavior by transforming yielded values and
  * returning them as the results of the yield
  * @func
  * @memberof iterable/sync
  * @sig (a → b) → Iterator<a> → b
  * @example
  * const iterator = (function*() {
  *   const one = yield { val: 1 };
  *   const two = yield { val: 2 };
  *   return one + two;
  * })();
  * // 3
  * yieldWith(({ val }) => val, iterator);
*/
const yieldWith = R.curry((onYield, iterator) => {

  let value, done;
  while (!done) {
    
    try {
      ({ value, done } = iterator.next(value));
      if (done) return value;
      value = onYield(value);
      
    } catch (err) {
      ({ value, done } = iterator.throw(err));
      if (done) return value;
      value = onYield(value);
    }

  }
  
});

/** Create coroutines with custom behavior by transforming yielded values and
  * returning them as the results of the yield. Works with `sync` iterables
  * @name yieldWith
  * @memberof iterable/async
  * @func
  * @async
  * @sig (a → Promise<b>) → AsyncIterator<a> → Promise<b>
  * @example
  * const iterator = (async function*() {
  *   const one = yield await { val: 1 };
  *   const two = yield await { val: 2 };
  *   return one + two;
  * })();
  * // 3
  * await yieldWith(async ({ val }) => val, iterator);
*/
const yieldWithAsync = R.curry(async (onYield, iterator) => {

  let value, done;
  while (!done) {
    
    try {
      ({ value, done } = await iterator.next(value));
      if (done) return value;
      value = await onYield(value);
      
    } catch (err) {
      ({ value, done } = await iterator.throw(err));
      if (done) return value;
      value = await onYield(value);
    }

  }
  
});

module.exports = {
  yieldWith,
  yieldWithAsync,
};
