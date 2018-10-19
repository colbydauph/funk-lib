/* eslint-disable no-underscore-dangle */
'use strict';

// modules
const R = require('ramda');

const { isNaN, isFinite, isInteger } = Number;
const { isArray } = Array;
const { isBuffer } = Buffer;

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
// fixme: this should be isIterator
// * -> boolean
const isGenerator = R.allPass([
  isObject,
  R.propSatisfies(isFunction, 'next'),
  R.propSatisfies(isFunction, 'throw'),
]);
// * -> boolean
const isSyncGenerator = R.allPass([
  isGenerator,
  // fixme: find a safer way to do this
  (thing) => (thing[Symbol.toStringTag] === 'Generator'),
]);
// * -> boolean
const isAsyncGenerator = R.allPass([
  isGenerator,
  // fixme: find a safer way to do this
  (thing) => (thing[Symbol.toStringTag] === 'AsyncGenerator'),
]);
// * -> boolean
const isSyncGeneratorFunction = R.allPass([
  isFunction,
  // fixme: find a safer way to do this
  (fn) => (fn.constructor.name === 'GeneratorFunction'),
]);
// * -> boolean
const isAsyncGeneratorFunction = R.allPass([
  isFunction,
  // fixme: find a safer way to do this
  (fn) => (fn.constructor.name === 'AsyncGeneratorFunction'),
]);
// * -> boolean
const isGeneratorFunction = R.anyPass([
  isSyncGeneratorFunction,
  isAsyncGeneratorFunction,
]);
// fixme: this does not seem to be named correctly
// * -> boolean
const isAsyncIterable = R.allPass([
  isTruthy,
  R.propSatisfies(isFunction, Symbol.asyncIterator),
]);
// fixme: this does not seem to be named correctly
// * -> boolean
const isIterable = R.allPass([
  isTruthy,
  R.propSatisfies(isFunction, Symbol.iterator),
]);

module.exports = {
  is,
  isArray,
  isAsyncGenerator,
  isAsyncGeneratorFunction,
  isAsyncIterable,
  isBoolean,
  isBuffer,
  isDate,
  isFalsey,
  isFloat,
  isFunction,
  isGenerator,
  isGeneratorFunction,
  isInstanceOf,
  isInteger,
  isIterable,
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
  isSyncGenerator,
  isSyncGeneratorFunction,
  isTruthy,
  isTypeOf,
  isUndefined,
};
