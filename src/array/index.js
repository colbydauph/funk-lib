// core
import { deprecate } from 'util';

// modules
import * as R from 'ramda';

// aliased
import { random } from 'funk-lib/number';


/** Transform an array into an object, where keys are indices, and values are elements.
  * @func
  * @todo rename to index
  * @sig [ k: v ] -> { k: v }
  * @example
  * toObj(['a', 'b', 'c']) // { 0: a, 1: b, 2: c }
*/
export const toObj = R.pipe(R.toPairs, R.fromPairs);

/** Given a function that generates a key, turns a list of objects into an object indexing the objects by the given key
  * @ignore
  * @func
  * @deprecated
  * @sig (a -> b) -> [a] -> { b: a }
*/
export const toObjBy = R.curryN(2)(deprecate(
  R.indexBy,
  'funk-lib/object/toObjBy -> R.indexBy'
));

/** Select a random array item
  * @func
  * @sig [t] -> t
  * @example
  * sample([0, 1, 2, 3, 4, 5]) // 2
*/
export const sample = arr => arr[random(0, arr.length - 1)];


/**
  * Immutably randomize array element order
  * Fisher-Yates shuffle
  * @func
  * @sig [t] -> [t]
  * @example shuffle([1, 2, 3, 4, 5]) // [4, 1, 2, 5, 3]
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
