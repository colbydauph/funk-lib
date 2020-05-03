// modules
import * as R from 'ramda';

/** Create coroutines with custom behavior by transforming yielded values and
  * returning them as the results of the yield
  * @func
  * @memberof iterable/sync
  * @sig (a → b) → Iterator<a> → b
  * @example
  * // arguments arranged fs-last
  * const readFile = path => fs => fs.readFile(path);
  *
  * // write filesystem logic without specifying *which* filesystem
  * const combineFiles = function* (paths) {
  *   let files = [];
  *   for await (const path of paths) {
  *     files = [...files, yield readFile(path)];
  *   }
  *   return files.join('\n');
  * }
  *
  * // mock filesystem
  * const fs = {
  *   readFile: file => `I am ${ file }!`,
  * };
  *
  * // apply filesystem to each yielded function
  * // "I am hello.txt!\nI am world.text!"
  * yieldWith(fn => fn(fs), combineFiles(['hello.txt', 'world.text']));
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
  * returning them as the results of the yield. Works with `async` and `sync` iterators
  * @name yieldWith
  * @memberof iterable/async
  * @func
  * @async
  * @sig (a → Promise<b>) → AsyncIterator<a> → Promise<b>
  * @example
  * // arguments arranged fs-last
  * const readFile = path => fs => fs.readFile(path);
  *
  * // write filesystem logic without specifying *which* filesystem
  * const combineFiles = async function* (paths) {
  *   let files = [];
  *   for await (const path of paths) {
  *     files = [...files, yield readFile(path)];
  *   }
  *   return files.join('\n');
  * }
  *
  * // mock filesystem
  * const fs = {
  *   readFile: async file => `I am ${ file }!`,
  * };
  *
  * // apply filesystem to each yielded function
  * // "I am hello.txt!\nI am world.text!"
  * await yieldWith(fn => fn(fs), combineFiles(['hello.txt', 'world.text']));
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
