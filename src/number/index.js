import * as R from 'ramda';

/** Get a random float between two inclusive bounds
  * @func
  * @sig Number → Number → Float
  * @example randomFloat(0, 100); // 42.38076848431584
*/
export const randomFloat = R.useWith((min, max) => {
  return Math.random() * (max - min) + min;
}, [
  R.max(Number.MIN_SAFE_INTEGER),
  R.min(Number.MAX_SAFE_INTEGER),
]);

/** Get a random integer between two inclusive bounds
  * @func
  * @sig Number → Number → Integer
  * @example random(0, 100); // 42
*/
export const random = R.useWith((min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}, [
  R.max(Number.MIN_SAFE_INTEGER),
  R.min(Number.MAX_SAFE_INTEGER),
]);
