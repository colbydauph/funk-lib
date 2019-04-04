// core
import { deprecate } from 'util';

// modules
import * as R from 'ramda';

// aliased
import { isObject } from 'funk-lib/is';


/** Get an object's first key: value pair
  * @func
  * @sig { k: v } → [k, v]
  * @example firstPair({ a: 1 }); // ['a', 1]
*/
export const firstPair = R.pipe(R.toPairs, R.nth(0));

/** Get an object's first key
  * @func
  * @sig { k: v } → k
  * @example firstKey({ a: 1 }); // 'a'
*/
export const firstKey = R.pipe(firstPair, R.nth(0));

/** Get an object's first value
  * @func
  * @sig { k: v } → v
  * @example firstValue({ a: 1 }); // 1
*/
export const firstValue = R.pipe(firstPair, R.nth(1));

/** Pick and rename object keys in a single operation
  * @func
  * @sig { k: w } → { k: v } → { w: v }
  * @example
  * // { a: 2, b: 1 }
  * pickAs({ a: 'b', b: 'a' }, { a: 1, b: 2 });
*/
export const pickAs = R.curry((keyVals, obj) => {
  return R.toPairs(keyVals).reduce((result, [key, val]) => {
    return R.assoc(val, obj[key], result);
  }, {});
});

/** Map object key / value pairs
  * @func
  * @sig ([a, b] → [c, d]) → { a: b } → { c: d }
  * @example mapPairs(R.reverse, { a: 1, b: 2 }); // { 1: 'a', 2: 'b' }
*/
export const mapPairs = R.curry((pred, obj) => {
  return R.fromPairs(R.map(pred, R.toPairs(obj)));
});

/** Map object keys
  * @func
  * @sig (k → k) → { k: v } → { k: v }
  * @example mapKeys(R.reverse, { one: 1, two: 2 }); // { eno: 1, owt: 2 }
*/
export const mapKeys = R.curry((pred, obj) => {
  return mapPairs(([key, value]) => [pred(key), value], obj);
});

// (v → m) → { k: v } → { k: m }
export const mapValues = R.curryN(2)(deprecate(
  R.map,
  'funk-lib/object/mapValues → R.map'
));

/** Recursive freeze a nested object (mutating + identity)
  * @func
  * @sig {*} → {*}
  * @example deepFreeze({ a: 1 }); // { a: 1 }
*/
export const deepFreeze = obj => {
  Object.freeze(obj);
  R.forEach(deepFreeze, R.values(obj));
  return obj;
};

/** Flatten a deeply nested object, joining keys with pred. inverse of nestWith
  * @func
  * @sig ((k, k) → l) → { k: v } → { l: v }
  * @example
  * // { 'src/one': 1, 'src/two/three': 3 }
  * flattenWith(R.unapply(R.join('/')), { src: { one: 1, two: { three: 3 } } });
*/
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

/** Deeply nest a flattened object, splitting keys with pred. inverse of flattenWith
  * @func
  * @sig (k → [l]) → { k: v } → { l: v }
  * @example
  * // { src: { one: 1, two: { three: 3 } } }
  * nestWith(R.split('/'), { 'src/one': 1, 'src/two/three': 3 });
*/
export const nestWith = R.curry((pred, obj) => {
  return R.reduce((obj, [key, val]) => {
    return R.assocPath(pred(key), val, obj);
  }, {}, R.toPairs(obj));
});

/** Serialize to JSON with newlines and 2-space indentation
  * @func
  * @sig JSON → String
  * @example
  * // '{
  * //   "one": {
  * //     "two": 2
  * //   }
  * // }'
  * toHumanJSON({ one: { two: 2 } });
*/
export const toHumanJSON = obj => JSON.stringify(obj, null, 2);

/** Delete an object property. mutative / identity
  * @func
  * @sig String → {a} → {a}
  * @example
  * const obj = { a: 1, b: 2 };
  * del('a', obj); // obj === { b: 2 }
*/
export const del = R.curry((prop, obj) => (delete obj[prop], obj));

/** Delete all object properties. mutative / identity
  * @func
  * @sig {a} → {}
  * @example
  * const obj = { a: 1, b: 2 };
  * clear(obj); // obj === {}
*/
export const clear = obj => Object.keys(obj).reduce(R.flip(del), obj);

/** Recursively map a deep object's leaf nodes
  * @func
  * @sig (a → b) → { k: a } → { k: b }
  * @example
  * // { a: { b: 2, c: { d: 3 } } }
  * mapLeafNodes(n => (n + 1), { a: { b: 1, c: { d: 2 } } });
*/
export const mapLeafNodes = R.curry((pred, obj) => {
  const transform = R.ifElse(isObject, mapLeafNodes(pred), pred);

  return isObject(obj)
    ? R.map(transform, obj)
    : transform(obj);
});

/** Is an object empty?
  * @func
  * @sig {a} -> Boolean
  * @example
  * isEmpty({}); // true
*/
export const isEmpty = obj => !Object.keys(obj).length;
