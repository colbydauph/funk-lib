/* eslint-disable no-underscore-dangle */
// modules
import * as R from 'ramda';

// fixme: polyfill Symbol.asyncIterator
// https://github.com/babel/babel/issues/8450
// https://github.com/babel/babel/issues/7467
import 'core-js/modules/es7.symbol.async-iterator';

export const {
  /** Is finite?
    * @func
    * @sig a -> Boolean
    * @example
    * isFinite(10); // true
    * isFinite(Infinity); // false
  */
  isFinite,
  
  /** Is integer?
    * @func
    * @sig a -> Boolean
    * @example
    * isInteger(1); // true
    * isInteger(1.23); // false
  */
  isInteger,
  
  /** Is NaN?
    * @func
    * @sig a -> Boolean
    * @example isNaN(NaN); // true
  */
  isNaN,
} = Number;

export const {
  /** Is Array?
    * @func
    * @sig a -> Boolean
    * @example isArray([]); // true
  */
  isArray,
} = Array;

export const {
  /** Is Buffer?
    * @func
    * @sig a -> Boolean
  */
  isBuffer,
} = Buffer;

/** Is equal (strict reference equality)
  * @func
  * @sig a -> b -> Boolean
*/
export const is = R.curry((left, right) => (left === right));

/** Is not equal (strict reference equality)
  * @func
  * @sig a -> b -> Boolean
*/
export const isNot = R.complement(is);

/** Is instance of class?
  * @func
  * @sig String -> a -> Boolean
  * @example isInstanceOf(Array, []); // true
*/
export const isInstanceOf = R.curry((type, thing) => (thing instanceof type));

/** Is type of?
  * @func
  * @sig String -> a -> Boolean
  * @example isTypeOf('boolean', true); // true
*/
export const isTypeOf = R.curry((type, thing) => is(type, typeof thing));

/** Is Boolean?
  * @func
  * @sig a -> Boolean
  * @example isBoolean(false); // true
*/
export const isBoolean = isTypeOf('boolean');

/** Is Date?
  * @func
  * @sig a -> Boolean
  * @example isDate(new Date()); // true
*/
export const isDate = isInstanceOf(Date);

/** Is regular expression?
  * @func
  * @sig a -> Boolean
  * @example isRegExp(/[a-z]/); // true
*/
export const isRegExp = isInstanceOf(RegExp);

/** Is function?
  * @func
  * @sig a -> Boolean
  * @example isFunction(() => {}); // true
*/
export const isFunction = isTypeOf('function');

/** Is null?
  * @func
  * @sig a -> Boolean
  * @example isNull(null); // true
*/
export const isNull = is(null);

/** Is string?
  * @func
  * @sig a -> Boolean
  * @example isString('hello'); // true
*/
export const isString = isTypeOf('string');

/** Is symbol?
  * @func
  * @sig a -> Boolean
*/
export const isSymbol = isTypeOf('symbol');

/** Is undefined?
  * @func
  * @sig a -> Boolean
  * @example isUndefined(undefined); // true
*/
export const isUndefined = isTypeOf('undefined');

/** Is number?
  * @func
  * @sig a -> Boolean
  * @example
  * isNumber(10); // true
  * isNumber(NaN); // false
*/
export const isNumber = R.allPass([isTypeOf('number'), R.complement(isNaN)]);

/** Is negative?
  * @func
  * @sig a -> Boolean
  * @example
  * isNumber(-10); // true
  * isNumber(10); // false
*/
export const isNegative = R.lt(R.__, 0);

/** Is positive?
  * @func
  * @sig a -> Boolean
  * @example
  * isNumber(10); // true
  * isNumber(-10); // false
*/
export const isPositive = R.gte(R.__, 0);

/** Is float?
  * @func
  * @sig a -> Boolean
  * @example
  * isFloat(1.23); // true
  * isFloat(1); // false
*/
export const isFloat = R.allPass([isFinite, R.complement(isInteger)]);

/** Is truthy?
  * @func
  * @sig a -> Boolean
  * @example isTruthy(1); // true
*/
export const isTruthy = R.pipe(R.not, R.not);

/** Is false?
  * @func
  * @sig a -> Boolean
  * @example isFalsey(0); // true
*/
export const isFalsey = R.not;

/** Is object?
  * @func
  * @sig a -> Boolean
  * @example
  * isObject({}); // true
  * isObject([]]); // false
  * isObject(null); // false
*/
export const isObject = R.allPass([
  isTypeOf('object'),
  R.complement(isNull),
  R.complement(isArray),
]);

/** Is promise?
  * @func
  * @sig a -> Boolean
  * @example isPromise(Promise.resolve(1)); // true
*/
export const isPromise = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'then'),
  R.propSatisfies(isFunction, 'catch'),
]);

/** Is stream?
  * @func
  * @sig a -> Boolean
*/
export const isStream = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'pipe'),
]);

/** Is "plain old javascript object"?
  * @func
  * @sig a -> Boolean
  * @example isPojo({}); // true
*/
export const isPojo = R.allPass([
  isObject,
  R.pipe(Object.getPrototypeOf, is(Object.prototype)),
]);

/** Is iterator?
  * @func
  * @sig a -> Boolean
  * @example
  * const iterator = [][Symbol.iterator]();
  * isIterator(iterator); // true
*/
export const isIterator = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'next'),
]);

/** Is iterable?
  * @func
  * @sig a -> Boolean
  * @example
  * isIterable([]); // true
*/
export const isIterable = R.allPass([
  isTruthy,
  R.propSatisfies(isFunction, Symbol.iterator),
]);

/** Is async iterable?
  * @func
  * @sig a -> Boolean
*/
export const isAsyncIterable = R.allPass([
  isTruthy,
  R.propSatisfies(isFunction, Symbol.asyncIterator),
]);
