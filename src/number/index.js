import { max, min, useWith } from 'ramda';

/** Get a random number between two inclusive bounds
  * @func
  * @sig Integer → Integer → Integer
  * @example random(0, 100); // 42
*/
export const random = useWith((min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}, [
  max(Number.MIN_SAFE_INTEGER),
  min(Number.MAX_SAFE_INTEGER),
]);
