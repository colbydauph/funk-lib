/* eslint-disable no-underscore-dangle */
// modules
import * as R from 'ramda';

// fixme: polyfill Symbol.asyncIterator
// https://github.com/babel/babel/issues/8450
// https://github.com/babel/babel/issues/7467
import 'core-js/modules/es7.symbol.async-iterator';

export const {
  // * -> boolean
  isFinite,
  // * -> boolean
  isInteger,
  // * -> boolean
  isNaN,
} = Number;

export const {
  // * -> boolean
  isArray,
} = Array;

export const {
  // * -> boolean
  isBuffer,
} = Buffer;

// referentially equal
// * -> * -> boolean
export const is = R.curry((left, right) => (left === right));
// * -> * -> boolean
export const isNot = R.complement(is);
// string -> * -> boolean
export const isInstanceOf = R.curry((type, thing) => thing instanceof type);
// string -> * -> boolean
export const isTypeOf = R.curry((type, thing) => is(type, typeof thing));
// * -> boolean
export const isBoolean = isTypeOf('boolean');
// * -> boolean
export const isDate = isInstanceOf(Date);
// * -> boolean
export const isRegExp = isInstanceOf(RegExp);
// * -> boolean
export const isFunction = isTypeOf('function');
// * -> boolean
export const isNull = is(null);
// * -> boolean
export const isString = isTypeOf('string');
// * -> boolean
export const isSymbol = isTypeOf('symbol');
// * -> boolean
export const isUndefined = isTypeOf('undefined');
// * -> boolean
export const isNumber = R.allPass([isTypeOf('number'), R.complement(isNaN)]);
// * -> boolean
export const isNegative = R.lt(R.__, 0);
// * -> boolean
export const isPositive = R.gte(R.__, 0);
// * -> boolean
export const isFloat = R.allPass([isFinite, R.complement(isInteger)]);
// * -> boolean
export const isTruthy = R.pipe(R.not, R.not);
// * -> boolean
export const isFalsey = R.not;
// * -> boolean
export const isObject = R.allPass([
  isTypeOf('object'),
  R.complement(isNull),
  R.complement(isArray),
]);
// * -> boolean
export const isPromise = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'then'),
  R.propSatisfies(isFunction, 'catch'),
]);
// * -> boolean
export const isStream = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'pipe'),
]);
// is "plain old javascript object"
// * -> boolean
export const isPojo = R.allPass([
  isObject,
  R.pipe(Object.getPrototypeOf, is(Object.prototype)),
]);

// * -> boolean
export const isIterator = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'next'),
]);
// * -> boolean
export const isIterable = R.allPass([
  isTruthy,
  R.propSatisfies(isFunction, Symbol.iterator),
]);
// * -> boolean
export const isAsyncIterable = R.allPass([
  isTruthy,
  R.propSatisfies(isFunction, Symbol.asyncIterator),
]);
