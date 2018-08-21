'use strict';

// modules
const R = require('ramda');

const { isNaN } = Number;
const { isArray } = Array;
const { isBuffer } = Buffer;

const isInstanceOf = R.curry((constructor, thing) => (thing instanceof constructor));
const isTypeOf = R.curry((type, thing) => (typeof thing === type));

const isBoolean = isTypeOf('boolean');
const isDate = isInstanceOf(Date);
const isRegExp = isInstanceOf(RegExp);
const isFunction = isTypeOf('function');
const isNull = R.equals(null);
const isString = isTypeOf('string');
const isSymbol = isTypeOf('symbol');
const isUndefined = isTypeOf('undefined');

// * -> boolean
const isObject = R.allPass([
  isTypeOf('object'),
  R.complement(isNull),
  R.complement(isArray),
]);

// is "plain old javascript object"
// * -> boolean
const isPojo = R.allPass([
  isObject,
  R.pipe(Object.getPrototypeOf, (proto) => {
    return (proto === Object.prototype);
  }),
]);

const isNumber = R.allPass([isTypeOf('number'), R.complement(isNaN)]);
const isNegative = R.flip(R.lt)(0);
const isPositive = R.flip(R.gte)(0);

const isTruthy = R.pipe(R.not, R.not);
const isFalsey = R.not;

const isPromise = R.allPass([isObject, R.pipe(R.prop('then'), isFunction)]);
const isStream = R.allPass([isObject, R.pipe(R.prop('pipe'), isFunction)]);

// * -> boolean
const isGenerator = R.allPass([
  isObject,
  R.pipe(R.prop('next'), isFunction),
  R.pipe(R.prop('throw'), isFunction),
]);


const isSyncGenerator = R.allPass([
  isGenerator,
  // fixme: find a safer way to do this
  (thing) => (thing[Symbol.toStringTag] === 'Generator'),
]);

const isAsyncGenerator = R.allPass([
  isGenerator,
  // fixme: find a safer way to do this
  (thing) => (thing[Symbol.toStringTag] === 'AsyncGenerator'),
]);

const isSyncGeneratorFunction = R.allPass([
  isFunction,
  // fixme: find a safer way to do this
  (fn) => (fn.constructor.name === 'GeneratorFunction'),
]);

const isAsyncGeneratorFunction = R.allPass([
  isFunction,
  // fixme: find a safer way to do this
  (fn) => (fn.constructor.name === 'AsyncGeneratorFunction'),
]);

const isGeneratorFunction = R.anyPass([
  isSyncGeneratorFunction,
  isAsyncGeneratorFunction,
]);

const isIterable = R.allPass([
  isTruthy,
  R.pipe(R.prop(Symbol.iterator), isFunction),
]);
const isAsyncIterable = R.allPass([
  isTruthy,
  R.pipe(R.prop(Symbol.asyncIterator), isFunction),
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
