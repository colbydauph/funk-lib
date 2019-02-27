import * as R from 'ramda';

// inclusive bounds
// int -> int -> int
export const random = R.useWith((min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}, [
  R.max(Number.MIN_SAFE_INTEGER),
  R.min(Number.MAX_SAFE_INTEGER),
]);
