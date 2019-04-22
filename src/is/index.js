/* eslint-disable no-underscore-dangle */
// modules
import * as R from 'ramda';

// fixme: polyfill Symbol.asyncIterator
// https://github.com/babel/babel/issues/8450
// https://github.com/babel/babel/issues/7467
import 'core-js/modules/es7.symbol.async-iterator';

export const {
  /** Is a value finite?
    * @func
    * @sig a → Boolean
    * @example
    * isFinite(10); // true
    * isFinite(Infinity); // false
  */
  isFinite,
  
  /** Is a value an integer?
    * @func
    * @sig a → Boolean
    * @example
    * isInteger(1); // true
    * isInteger(1.23); // false
  */
  isInteger,
  
  /** Is a value NaN?
    * @func
    * @sig a → Boolean
    * @example isNaN(NaN); // true
  */
  isNaN,
} = Number;

export const {
  /** Is a value an Array?
    * @func
    * @sig a → Boolean
    * @example isArray([]); // true
  */
  isArray,
} = Array;

export const {
  /** Is a value a Buffer?
    * @func
    * @sig a → Boolean
    * @example
    * isBuffer(Buffer.from([])); // true
  */
  isBuffer,
} = Buffer;

/** Are two values equal by strict reference equality?
  * @func
  * @sig a → b → Boolean
  * @example
  * const sym = Symbol();
  * is(sym, sym); // true
  * is(1, true); // false
*/
export const is = R.curry((left, right) => (left === right));

/** Are two values not equal by strict reference equality?
  * @func
  * @sig a → b → Boolean
  * @example
  * const sym = Symbol();
  * isNot(1, true); // true
  * isNot(sym, sym); // false
*/
export const isNot = R.complement(is);

/** Is a value an instance of a class?
  * @func
  * @sig String → a → Boolean
  * @example isInstanceOf(Array, []); // true
*/
export const isInstanceOf = R.curry((type, thing) => (thing instanceof type));

/** Does a value have a certin type (via `typeof`)?
  * @func
  * @sig String → a → Boolean
  * @example isTypeOf('boolean', true); // true
*/
export const isTypeOf = R.curry((type, thing) => is(type, typeof thing));

/** Is a value a Boolean?
  * @func
  * @sig a → Boolean
  * @example isBoolean(false); // true
*/
export const isBoolean = isTypeOf('boolean');

/** Is a value a Date?
  * @func
  * @sig a → Boolean
  * @example isDate(new Date()); // true
*/
export const isDate = isInstanceOf(Date);

/** Is a value a regular expression?
  * @func
  * @sig a → Boolean
  * @example isRegExp(/[a-z]/); // true
*/
export const isRegExp = isInstanceOf(RegExp);

/** Is a value a function?
  * @func
  * @sig a → Boolean
  * @example isFunction(() => {}); // true
*/
export const isFunction = isTypeOf('function');

/** Is a value null?
  * @func
  * @sig a → Boolean
  * @example isNull(null); // true
*/
export const isNull = is(null);

/** Is a value a string?
  * @func
  * @sig a → Boolean
  * @example isString('hello'); // true
*/
export const isString = isTypeOf('string');

/** Is a value a symbol?
  * @func
  * @sig a → Boolean
  * @example isSymbol(Symbol('foo')); // true
*/
export const isSymbol = isTypeOf('symbol');

/** Is a value undefined?
  * @func
  * @sig a → Boolean
  * @example isUndefined(undefined); // true
*/
export const isUndefined = isTypeOf('undefined');

/** Is a value a number?
  * @func
  * @sig a → Boolean
  * @example
  * isNumber(10); // true
  * isNumber(NaN); // false
*/
export const isNumber = R.allPass([isTypeOf('number'), R.complement(isNaN)]);

/** Is a value even?
  * @func
  * @sig a → Boolean
  * @example
  * isEven(2); // true
  * isEven(3); // false
*/
export const isEven = n => !(n % 2);

/** Is a value odd?
  * @func
  * @sig a → Boolean
  * @example
  * isOdd(1); // true
  * isOdd(2); // false
*/
export const isOdd = R.complement(isEven);

/** Is a value negative?
  * @func
  * @sig a → Boolean
  * @example
  * isNumber(-10); // true
  * isNumber(10); // false
*/
export const isNegative = R.lt(R.__, 0);

/** Is a value positive?
  * @func
  * @sig a → Boolean
  * @example
  * isNumber(10); // true
  * isNumber(-10); // false
*/
export const isPositive = R.gte(R.__, 0);

/** Is a value a float?
  * @func
  * @sig a → Boolean
  * @example
  * isFloat(1.23); // true
  * isFloat(1); // false
*/
export const isFloat = R.allPass([isFinite, R.complement(isInteger)]);

/** Is a value truthy?
  * @func
  * @sig a → Boolean
  * @example isTruthy(1); // true
*/
export const isTruthy = R.pipe(R.not, R.not);

/** Is a value falsey?
  * @func
  * @sig a → Boolean
  * @example isFalsey(0); // true
*/
export const isFalsey = R.not;

/** Is a value an object?
  * @func
  * @sig a → Boolean
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

/** Is a value a promise?
  * @func
  * @sig a → Boolean
  * @example isPromise(Promise.resolve(1)); // true
*/
export const isPromise = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'then'),
  R.propSatisfies(isFunction, 'catch'),
]);

/** Is a value a stream?
  * @func
  * @sig a → Boolean
  * @example
  * isStream(new Stream.Readable()); // true
*/
export const isStream = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'pipe'),
]);

/** Is a value a "plain old javascript object"?
  * @func
  * @todo consider renaming to isPlainObj
  * @sig a → Boolean
  * @example isPojo({}); // true
*/
export const isPojo = R.allPass([
  isObject,
  R.pipe(Object.getPrototypeOf, is(Object.prototype)),
]);

/** Is a value an iterator?
  * @func
  * @sig a → Boolean
  * @example
  * const iterator = [][Symbol.iterator]();
  * isIterator(iterator); // true
*/
export const isIterator = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'next'),
]);

/** Is a value an iterable?
  * @func
  * @sig a → Boolean
  * @example
  * isIterable([]); // true
  * isIterable({ [Symbol.iterator]: () => {} }); // true
*/
export const isIterable = R.allPass([
  isTruthy,
  R.propSatisfies(isFunction, Symbol.iterator),
]);

/** Is a value an async iterable?
  * @func
  * @sig a → Boolean
  * @example
  * isAsyncIterable((async function* () {})()); // true
  * isAsyncIterable({ [Symbol.asyncIterator]: () => {} }); // true
*/
export const isAsyncIterable = R.allPass([
  isTruthy,
  R.propSatisfies(isFunction, Symbol.asyncIterator),
]);
