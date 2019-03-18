// core
import { deprecate } from 'util';

// modules
import * as R from 'ramda';

// aliased
import { isObject } from 'funk-lib/is';


/** Get an object's first key: value pair
  * @func
  * @sig { k: v } -> [k, v]
*/
export const firstPair = R.pipe(R.toPairs, R.nth(0));

/** Get an object's first key
  * @func
  * @sig { k: v } -> k
*/
export const firstKey = R.pipe(firstPair, R.nth(0));

/** Get an object's first value
  * @func
  * @sig { k: v } -> v
*/
export const firstValue = R.pipe(firstPair, R.nth(1));

// todo: pickAsDeep (recursive)
// pick the keys from the first argument, renaming by the values in the second arg
// pickAs({ a: 'b', b: 'a' }, { a: 1, b: 2 }) === { a: 2, b: 1 }
// object -> object -> object
export const pickAs = R.curry((keyVals, obj) => {
  return R.toPairs(keyVals).reduce((result, [key, val]) => {
    return R.assoc(val, obj[key], result);
  }, {});
});

/** Map object key / value pairs
  * @func
  * @sig ([a, b] -> [c, d]) -> { a: b } -> { c: d }
*/
export const mapPairs = R.curry((pred, obj) => {
  return R.fromPairs(R.map(pred, R.toPairs(obj)));
});

/** Map object keys
  * @func
  * @sig (k -> k) -> { k: v } -> { k: v }
  * @example
  * mapKeys(R.reverse, { one: 1, two: 2 }); // { eno: 1, owt: 2 }
*/
export const mapKeys = R.curry((pred, obj) => {
  return mapPairs(([key, value]) => [pred(key), value], obj);
});

// (v -> m) -> { k: v } -> { k: m }
export const mapValues = R.curryN(2)(deprecate(
  R.map,
  'funk-lib/object/mapValues -> R.map'
));

/** recursive + mutating + identity
  * @func
  * @sig {*} -> {*}
*/
export const deepFreeze = obj => {
  Object.freeze(obj);
  R.forEach(deepFreeze, R.values(obj));
  return obj;
};

// flatten a deeply nested object, joining keys with pred
// inverse of nestWith
export const flattenWith = R.curry((pred, obj) => {
  const flatPairs = R.pipe(
    R.toPairs,
    R.chain(([key, val]) => {
      return isObject(val)
        ? R.map(([k2, v2]) => [pred(key, k2), v2], flatPairs(val))
        : [[key, val]];
    }),
  );
  return R.fromPairs(flatPairs(obj));
});

// deeply nest a flattened object, splitting keys with pred
// inverse of flattenWith
export const nestWith = R.curry((pred, obj) => {
  return R.reduce((obj, [key, val]) => {
    return R.assocPath(pred(key), val, obj);
  }, {}, R.toPairs(obj));
});

/** Serialize to JSON with newlines and indentation
  * @func
  * @sig JSON -> String
*/
export const toHumanJSON = obj => JSON.stringify(obj, null, 2);


// // recursive R.merge with predicate for custom merging
// const mergeDeepWith = R.curry((pred, left, right) => {
//   return R.mergeWith((left, right) => {
//     if (isObject(left) && isObject(right)) return mergeDeepWith(pred, left, right);
//     return pred(left, right);
//   }, left, right);
// });
