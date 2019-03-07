"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAsyncIterable = exports.isIterable = exports.isIterator = exports.isPojo = exports.isStream = exports.isPromise = exports.isObject = exports.isFalsey = exports.isTruthy = exports.isFloat = exports.isPositive = exports.isNegative = exports.isNumber = exports.isUndefined = exports.isSymbol = exports.isString = exports.isNull = exports.isFunction = exports.isRegExp = exports.isDate = exports.isBoolean = exports.isTypeOf = exports.isInstanceOf = exports.isNot = exports.is = exports.isBuffer = exports.isArray = exports.isNaN = exports.isInteger = exports.isFinite = void 0;

var R = _interopRequireWildcard(require("ramda"));

require("core-js/modules/es7.symbol.async-iterator");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const {
  isFinite,
  isInteger,
  isNaN
} = Number;
exports.isNaN = isNaN;
exports.isInteger = isInteger;
exports.isFinite = isFinite;
const {
  isArray
} = Array;
exports.isArray = isArray;
const {
  isBuffer
} = Buffer;
exports.isBuffer = isBuffer;
const is = R.curry((left, right) => left === right);
exports.is = is;
const isNot = R.complement(is);
exports.isNot = isNot;
const isInstanceOf = R.curry((type, thing) => thing instanceof type);
exports.isInstanceOf = isInstanceOf;
const isTypeOf = R.curry((type, thing) => is(type, typeof thing));
exports.isTypeOf = isTypeOf;
const isBoolean = isTypeOf('boolean');
exports.isBoolean = isBoolean;
const isDate = isInstanceOf(Date);
exports.isDate = isDate;
const isRegExp = isInstanceOf(RegExp);
exports.isRegExp = isRegExp;
const isFunction = isTypeOf('function');
exports.isFunction = isFunction;
const isNull = is(null);
exports.isNull = isNull;
const isString = isTypeOf('string');
exports.isString = isString;
const isSymbol = isTypeOf('symbol');
exports.isSymbol = isSymbol;
const isUndefined = isTypeOf('undefined');
exports.isUndefined = isUndefined;
const isNumber = R.allPass([isTypeOf('number'), R.complement(isNaN)]);
exports.isNumber = isNumber;
const isNegative = R.lt(R.__, 0);
exports.isNegative = isNegative;
const isPositive = R.gte(R.__, 0);
exports.isPositive = isPositive;
const isFloat = R.allPass([isFinite, R.complement(isInteger)]);
exports.isFloat = isFloat;
const isTruthy = R.pipe(R.not, R.not);
exports.isTruthy = isTruthy;
const isFalsey = R.not;
exports.isFalsey = isFalsey;
const isObject = R.allPass([isTypeOf('object'), R.complement(isNull), R.complement(isArray)]);
exports.isObject = isObject;
const isPromise = R.allPass([isObject, R.propSatisfies(isFunction, 'then'), R.propSatisfies(isFunction, 'catch')]);
exports.isPromise = isPromise;
const isStream = R.allPass([isObject, R.propSatisfies(isFunction, 'pipe')]);
exports.isStream = isStream;
const isPojo = R.allPass([isObject, R.pipe(Object.getPrototypeOf, is(Object.prototype))]);
exports.isPojo = isPojo;
const isIterator = R.allPass([isObject, R.propSatisfies(isFunction, 'next')]);
exports.isIterator = isIterator;
const isIterable = R.allPass([isTruthy, R.propSatisfies(isFunction, Symbol.iterator)]);
exports.isIterable = isIterable;
const isAsyncIterable = R.allPass([isTruthy, R.propSatisfies(isFunction, Symbol.asyncIterator)]);
exports.isAsyncIterable = isAsyncIterable;