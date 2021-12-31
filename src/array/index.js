// core
import { deprecate } from 'util';

// modules
import * as R from 'ramda';

// aliased
import { random } from 'funk-lib/number';


/** Transform an array into an object, where keys are indices, and values are elements
  * @func
  * @todo rename to index
  * @sig [ k: v ] → { k: v }
  * @example
  * toObj(['a', 'b', 'c']); // { 0: a, 1: b, 2: c }
*/
export const toObj = R.pipe(R.toPairs, R.fromPairs);

/** Given a function that generates a key, turns a list of objects into an object indexing the objects by the given key
  * @ignore
  * @func
  * @deprecated since v0.15.2
  * @sig (a → b) → [a] → { b: a }
*/
export const toObjBy = R.curryN(2)(deprecate(
  R.indexBy,
  'funk-lib/object/toObjBy → R.indexBy',
));

/** Select a random array item
  * @func
  * @sig [a] → a
  * @example
  * sample([0, 1, 2, 3, 4, 5]); // 2
*/
export const sample = arr => arr[random(0, arr.length - 1)];

/** Delete all items. Mutating + identity
  * @func
  * @sig [a] → []
  * @example
  * const arr = [1, 2, 3];
  * clear(arr); // arr === []
*/
export const clear = arr => (arr.splice(0), arr);

/** Copy array items into a new array. Shallow - does not clone items themselves
  * @func
  * @sig [a] → [a]
  * @example
  * const arr = [1, 2, 3];
  * const arr2 = clone(arr); // [1, 2, 3]
  * arr === arr2 // false
*/
export const clone = arr => arr.slice(0);

/**
  * Immutably randomize array element order via Fisher-Yates shuffle
  * @func
  * @sig [a] → [a]
  * @example shuffle([1, 2, 3, 4, 5]); // [4, 1, 2, 5, 3]
*/
export const shuffle = ogArr => {
  const arr = clone(ogArr);
  
  // eslint-disable-next-line id-length
  let j, x, i;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
};
