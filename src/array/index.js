// core
import { deprecate } from 'util';

// modules
import * as R from 'ramda';

// aliased
import { random } from 'funk-lib/number';


// todo: rename to index
// [v] -> object<k, v>
export const toObj = R.pipe(R.toPairs, R.fromPairs);

// (a -> b) -> [a] -> object<b, a>
export const toObjBy = R.curryN(2)(deprecate(
  R.indexBy,
  'funk-lib/object/toObjBy -> R.indexBy'
));

// select a random array item
// [t] -> t
export const sample = arr => arr[random(0, arr.length - 1)];

// immutably randomize array element order
// Fisher-Yates shuffle
// [t] -> [t]
export const shuffle = (arr) => {
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
