import { max, min, useWith } from 'ramda';

/** inclusive bounds
  * @func
  * @sig int -> int -> int
*/
export const random = useWith((min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}, [
  max(Number.MIN_SAFE_INTEGER),
  min(Number.MAX_SAFE_INTEGER),
]);
