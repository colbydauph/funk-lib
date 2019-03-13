/** @module array */

// core
import { deprecate } from 'util';

// modules
import * as R from 'ramda';

// aliased
import { random } from 'funk-lib/number';


/** Transform an array into an object, where keys are indices, and values are elements.
  * @func
  * @todo rename to index
  * @sig [v] -> object<k, v>
*/
export const toObj = R.pipe(R.toPairs, R.fromPairs);

/** Given a function that generates a key, turns a list of objects into an object indexing the objects by the given key
  * @func
  * @deprecated
  * @sig (a -> b) -> [a] -> object<b, a>
*/
export const toObjBy = R.curryN(2)(deprecate(
  R.indexBy,
  'funk-lib/object/toObjBy -> R.indexBy'
));

/** Select a random array item
  * @func
  * @sig [t] -> t
  * @param {array.t} arr The array to select an item from
  * @return {t} A random array item
*/
export const sample = arr => arr[random(0, arr.length - 1)];


/**
  * Immutably randomize array element order
  * Fisher-Yates shuffle
  * @func
  * @sig [t] -> [t]
  * @example shuffle([1, 2, 3, 4, 5]) // [4, 1, 2, 5, 3]
  * @param {array.t} arr The array to shuffle
  * @return {array.t} Array with items shuffled
*/
export const shuffle = arr => {
  arr = [...arr];
  
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
