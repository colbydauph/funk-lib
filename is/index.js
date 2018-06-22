'use strict';

// modules
const R = require('ramda');

const { isNaN } = Number;
const { isArray } = Array;
const { isBuffer } = Buffer;
const isInstanceOf = R.curry((type, thing) => thing instanceof type);
const isTypeOf = R.curry((type, thing) => typeof thing === type);
const isNull = R.equals(null);
const isUndefined = isTypeOf('undefined');
const isObject = R.allPass([
  isTypeOf('object'),
  R.complement(isNull),
  R.complement(isArray),
]);
const isBoolean = isTypeOf('boolean');
const isFunction = isTypeOf('function');
const isString = isTypeOf('string');
const isNumber = R.allPass([isTypeOf('number'), R.complement(isNaN)]);
const isTruthy = R.pipe(R.not, R.not);
const isFalsey = R.not;
const isPromise = R.allPass([isObject, R.pipe(R.prop('then'), isFunction)]);
const isStream = R.allPass([isObject, R.pipe(R.prop('pipe'), isFunction)]);
const isNegative = R.flip(R.lt)(0);
const isPositive = R.flip(R.gte)(0);

// * -> boolean
const isGenerator = R.allPass([
  isObject,
  R.pipe(R.prop('next'), isFunction),
  R.pipe(R.prop('throw'), isFunction),
]);

// fixme: there must be a safer way to do this
// const GeneratorFunction = Object.getPrototypeOf(function* () {}).constructor;
const isSyncGenerator = R.allPass([
  isGenerator,
  (thing) => (thing[Symbol.toStringTag] === 'Generator'),
]);

// fixme: there must be a safer way to do this
// const GeneratorFunction = Object.getPrototypeOf(function* () {}).constructor;
const isAsyncGenerator = R.allPass([
  isGenerator,
  (thing) => (thing[Symbol.toStringTag] === 'AsyncGenerator'),
]);

const isSyncGeneratorFunction = R.allPass([
  isFunction,
  (fn) => (fn.constructor.name === 'GeneratorFunction'),
]);

const isAsyncGeneratorFunction = R.allPass([
  isFunction,
  (fn) => (fn.constructor.name === 'AsyncGeneratorFunction'),
]);

const isGeneratorFunction = R.anyPass([
  isSyncGeneratorFunction,
  isAsyncGeneratorFunction,
]);

// isAsyncIterable Symbol.asyncIterator
const isIterable = R.allPass([
  isTruthy,
  R.pipe(R.prop(Symbol.iterator), isFunction),
]);


module.exports = {
  isArray,
  isAsyncGenerator,
  isAsyncGeneratorFunction,
  isBoolean,
  isBuffer,
  isFalsey,
  isFunction,
  isGenerator,
  isGeneratorFunction,
  isInstanceOf,
  isIterable,
  isNaN,
  isNegative,
  isNull,
  isNumber,
  isObject,
  isPositive,
  isPromise,
  isStream,
  isString,
  isSyncGenerator,
  isSyncGeneratorFunction,
  isTruthy,
  isTypeOf,
  isUndefined,
};
