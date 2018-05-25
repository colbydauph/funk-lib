'use strict';

// modules
const R = require('ramda');

// const nonePass = R.pipe(R.anyPass, R.complement);

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
const isStream = R.allPass([R.identity, isObject, R.pipe(R.prop('pipe'), isFunction)]);
const isNegative = R.flip(R.lt)(0);
const isPositive = R.flip(R.gte)(0);
const isGenerator = R.allPass([
  isFunction,
  (fn) => (fn.constructor.name === 'GeneratorFunction'),
]);
const isIterable = R.allPass([
  isTruthy,
  (iter) => isFunction(iter[Symbol.iterator]),
]);
// const isJSON = nonePass([isFalsey, isString, isFunction, isStream, isBuffer, isPromise]);

module.exports = {
  // isJSON,
  isArray,
  isBoolean,
  isBuffer,
  isFalsey,
  isFunction,
  isInstanceOf,
  isIterable,
  isNaN,
  isNegative,
  isNull,
  isGenerator,
  isNumber,
  isObject,
  isPositive,
  isPromise,
  isStream,
  isString,
  isTruthy,
  isTypeOf,
  isUndefined,
};
