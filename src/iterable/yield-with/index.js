// modules
import * as R from 'ramda';

/** Create coroutines with custom behavior by transforming yielded values and
  * returning them as the results of the yield
  * @func
  * @memberof iterable/sync
  * @sig (a → b) → Iterator<a> → b
  * @example
  * const fetch = url => ({ id: 1 });
  * const iterator = (function* () {
  *   const user = yield 'https://foo.bar/user/1';
  *   return user;
  * })();
  * // { id: 1 }
  * yieldWith(fetch, iterator);
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
  * const fetch = async url => ({ id: 1 });
  * const iterator = (async function* () {
  *   const user = yield await 'https://foo.bar/user/1';
  *   return user;
  * })();
  * // { id: 1 }
  * await yieldWith(fetch, iterator);
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
