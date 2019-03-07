function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import * as R from 'ramda';
import 'core-js/modules/es7.symbol.async-iterator';
var isFinite = Number.isFinite,
    isInteger = Number.isInteger,
    isNaN = Number.isNaN;
export { isFinite, isInteger, isNaN };
var isArray = Array.isArray;
export { isArray };
var _Buffer = Buffer,
    isBuffer = _Buffer.isBuffer;
export { isBuffer };
export var is = R.curry(function (left, right) {
  return left === right;
});
export var isNot = R.complement(is);
export var isInstanceOf = R.curry(function (type, thing) {
  return thing instanceof type;
});
export var isTypeOf = R.curry(function (type, thing) {
  return is(type, _typeof(thing));
});
export var isBoolean = isTypeOf('boolean');
export var isDate = isInstanceOf(Date);
export var isRegExp = isInstanceOf(RegExp);
export var isFunction = isTypeOf('function');
export var isNull = is(null);
export var isString = isTypeOf('string');
export var isSymbol = isTypeOf('symbol');
export var isUndefined = isTypeOf('undefined');
export var isNumber = R.allPass([isTypeOf('number'), R.complement(isNaN)]);
export var isNegative = R.lt(R.__, 0);
export var isPositive = R.gte(R.__, 0);
export var isFloat = R.allPass([isFinite, R.complement(isInteger)]);
export var isTruthy = R.pipe(R.not, R.not);
export var isFalsey = R.not;
export var isObject = R.allPass([isTypeOf('object'), R.complement(isNull), R.complement(isArray)]);
export var isPromise = R.allPass([isObject, R.propSatisfies(isFunction, 'then'), R.propSatisfies(isFunction, 'catch')]);
export var isStream = R.allPass([isObject, R.propSatisfies(isFunction, 'pipe')]);
export var isPojo = R.allPass([isObject, R.pipe(Object.getPrototypeOf, is(Object.prototype))]);
export var isIterator = R.allPass([isObject, R.propSatisfies(isFunction, 'next')]);
export var isIterable = R.allPass([isTruthy, R.propSatisfies(isFunction, Symbol.iterator)]);
export var isAsyncIterable = R.allPass([isTruthy, R.propSatisfies(isFunction, Symbol.asyncIterator)]);