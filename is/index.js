'use strict';

// modules
const R = require('ramda');

const { isNaN, isInteger } = Number;
const { isArray } = Array;
const { isBuffer } = Buffer;

// string -> * -> boolean
const isInstanceOf = R.curry((type, thing) => thing instanceof type);
// string -> * -> boolean
const isTypeOf = R.curry((type, thing) => typeof thing === type);
// * -> boolean
const isBoolean = isTypeOf('boolean');
// * -> boolean
const isDate = isInstanceOf(Date);
// * -> boolean
const isRegExp = isInstanceOf(RegExp);
// * -> boolean
const isFunction = isTypeOf('function');
// * -> boolean
const isNull = R.equals(null);
// * -> boolean
const isString = isTypeOf('string');
// * -> boolean
const isSymbol = isTypeOf('symbol');
// * -> boolean
const isUndefined = isTypeOf('undefined');
// * -> boolean
const isNumber = R.allPass([isTypeOf('number'), R.complement(isNaN)]);
// * -> boolean
const isNegative = R.flip(R.lt)(0);
// * -> boolean
const isPositive = R.flip(R.gte)(0);
// * -> boolean
const isTruthy = R.pipe(R.not, R.not);
// * -> boolean
const isFalsey = R.not;
// * -> boolean
const isObject = R.allPass([isTypeOf('object'), R.complement(isNull), R.complement(isArray)]);
// * -> boolean
const isPromise = R.allPass([isObject, R.pipe(R.prop('then'), isFunction)]);
// * -> boolean
const isStream = R.allPass([isObject, R.pipe(R.prop('pipe'), isFunction)]);
// is "plain old javascript object"
// * -> boolean
const isPojo = R.allPass([
  isObject,
  R.pipe(Object.getPrototypeOf, (proto) => {
    return (proto === Object.prototype);
  }),
]);
// * -> boolean
const isGenerator = R.allPass([
  isObject,
  R.pipe(R.prop('next'), isFunction),
  R.pipe(R.prop('throw'), isFunction),
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
  R.pipe(R.prop(Symbol.asyncIterator), isFunction),
]);
// fixme: this does not seem to be named correctly
// * -> boolean
const isIterable = R.allPass([
  isTruthy,
  R.pipe(R.prop(Symbol.iterator), isFunction),
]);

module.exports = {
  isArray,
  isAsyncGenerator,
  isAsyncGeneratorFunction,
  isAsyncIterable,
  isBoolean,
  isBuffer,
  isDate,
  isFalsey,
  isFunction,
  isGenerator,
  isGeneratorFunction,
  isInstanceOf,
  isInteger,
  isIterable,
  isNaN,
  isNegative,
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
