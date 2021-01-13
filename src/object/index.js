// core
import { deprecate } from 'util';

// modules
import * as R from 'ramda';

// aliased
import { isObject } from 'funk-lib/is';


/** Get an object's first [key, value] pair
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
  * // { b: 1, c: 2 }
  * pickAs({ a: 'b', b: 'c' }, { a: 1, b: 2 });
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

/** Recursive freeze a nested object. Mutating + identity
  * @func
  * @sig {*} → {*}
  * @example
  * const obj = { a: 1 };
  * deepFreeze(obj); // { a: 1 }
  * obj.a = 2; // TypeError
*/
export const deepFreeze = obj => {
  Object.freeze(obj);
  R.forEach(deepFreeze, R.values(obj));
  return obj;
};

/** Flatten a deeply nested object, joining keys with with a binary function. Inverse of `object/nestWith`
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

/** Deeply nest a flattened object, splitting keys with a unary function. Inverse of `object/flattenWith`
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

/** Delete an object property. Mutating + identity
  * @func
  * @sig String → {a} → {a}
  * @example
  * const obj = { a: 1, b: 2 };
  * del('a', obj); // obj === { b: 2 }
*/
export const del = R.curry((prop, obj) => (delete obj[prop], obj));

/** Delete all object properties. Mutating + identity
  * @func
  * @sig {a} → {}
  * @example
  * const obj = { a: 1, b: 2 };
  * clear(obj); // obj === {}
*/
export const clear = obj => R.keys(obj).reduce(R.flip(del), obj);

/** Recursively map a deep object's leaf nodes
  * @func
  * @sig (a → b) → { k: a } → { k: b }
  * @example
  * // { a: { b: 2, c: { d: 3 } } }
  * mapDeep(n => (n + 1), { a: { b: 1, c: { d: 2 } } });
*/
export const mapDeep = R.useWith(R.map, [
  pred => R.ifElse(isObject, mapDeep(pred), pred),
  R.identity,
]);

/** Is an object empty?
  * @func
  * @deprecated since v0.15.2
  * @sig {a} → Boolean
  * @example
  * isEmpty({}); // true
*/
export const isEmpty = R.curryN(1)(deprecate(
  R.isEmpty,
  'funk-lib/object/isEmpty → R.isEmpty'
));
