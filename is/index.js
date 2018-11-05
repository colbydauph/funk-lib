/* eslint-disable no-underscore-dangle */
'use strict';

// modules
const R = require('ramda');

const {
  // * -> boolean
  isFinite,
  // * -> boolean
  isInteger,
  // * -> boolean
  isNaN,
} = Number;

const {
  // * -> boolean
  isArray,
} = Array;

const {
  // * -> boolean
  isBuffer,
} = Buffer;

// * -> * -> boolean
const is = R.curry((left, right) => (left === right));
// * -> * -> boolean
const isNot = R.complement(is);
// string -> * -> boolean
const isInstanceOf = R.curry((type, thing) => thing instanceof type);
// string -> * -> boolean
const isTypeOf = R.curry((type, thing) => is(type, typeof thing));
// * -> boolean
const isBoolean = isTypeOf('boolean');
// * -> boolean
const isDate = isInstanceOf(Date);
// * -> boolean
const isRegExp = isInstanceOf(RegExp);
// * -> boolean
const isFunction = isTypeOf('function');
// * -> boolean
const isNull = is(null);
// * -> boolean
const isString = isTypeOf('string');
// * -> boolean
const isSymbol = isTypeOf('symbol');
// * -> boolean
const isUndefined = isTypeOf('undefined');
// * -> boolean
const isNumber = R.allPass([isTypeOf('number'), R.complement(isNaN)]);
// * -> boolean
const isNegative = R.lt(R.__, 0);
// * -> boolean
const isPositive = R.gte(R.__, 0);
// * -> boolean
const isFloat = R.allPass([isFinite, R.complement(isInteger)]);
// * -> boolean
const isTruthy = R.pipe(R.not, R.not);
// * -> boolean
const isFalsey = R.not;
// * -> boolean
const isObject = R.allPass([
  isTypeOf('object'),
  R.complement(isNull),
  R.complement(isArray),
]);
// * -> boolean
const isPromise = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'then'),
  R.propSatisfies(isFunction, 'catch'),
]);
// * -> boolean
const isStream = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'pipe'),
]);
// is "plain old javascript object"
// * -> boolean
const isPojo = R.allPass([
  isObject,
  R.pipe(Object.getPrototypeOf, is(Object.prototype)),
]);

// * -> boolean
const isIterator = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'next'),
]);
// * -> boolean
const isIterable = R.allPass([
  isTruthy,
  R.propSatisfies(isFunction, Symbol.iterator),
]);
// * -> boolean
const isAsyncIterable = R.allPass([
  isTruthy,
  R.propSatisfies(isFunction, Symbol.asyncIterator),
]);


module.exports = {
  is,
  isArray,
  isAsyncIterable,
  isBoolean,
  isBuffer,
  isDate,
  isFalsey,
  isFinite,
  isFloat,
  isFunction,
  isInstanceOf,
  isInteger,
  isIterable,
  isIterator,
  isNaN,
  isNegative,
  isNot,
  isNull,
  isNumber,
  isObject,
  isPojo,
  isPositive,
  isPromise,
  isRegExp,
  isStream,
  isString,
  isSymbol,
  isTruthy,
  isTypeOf,
  isUndefined,
};
