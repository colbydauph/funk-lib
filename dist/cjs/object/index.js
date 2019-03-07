"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toHumanJSON = exports.nestWith = exports.flattenWith = exports.deepFreeze = exports.mapValues = exports.mapKeys = exports.mapPairs = exports.pickAs = exports.firstValue = exports.firstKey = exports.firstPair = void 0;

var _util = require("util");

var R = _interopRequireWildcard(require("ramda"));

var _is = require("../is");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const firstPair = R.pipe(R.toPairs, R.nth(0));
exports.firstPair = firstPair;
const firstKey = R.pipe(firstPair, R.nth(0));
exports.firstKey = firstKey;
const firstValue = R.pipe(firstPair, R.nth(1));
exports.firstValue = firstValue;
const pickAs = R.curry((keyVals, obj) => {
  return R.toPairs(keyVals).reduce((result, [key, val]) => {
    return R.assoc(val, obj[key], result);
  }, {});
});
exports.pickAs = pickAs;
const mapPairs = R.curry((pred, obj) => {
  return R.fromPairs(R.map(pred, R.toPairs(obj)));
});
exports.mapPairs = mapPairs;
const mapKeys = R.curry((pred, obj) => {
  return mapPairs(([key, value]) => [pred(key), value], obj);
});
exports.mapKeys = mapKeys;
const mapValues = R.curryN(2)((0, _util.deprecate)(R.map, 'funk-lib/object/mapValues -> R.map'));
exports.mapValues = mapValues;

const deepFreeze = obj => {
  Object.freeze(obj);
  R.forEach(deepFreeze, R.values(obj));
  return obj;
};

exports.deepFreeze = deepFreeze;
const flattenWith = R.curry((pred, obj) => {
  const flatPairs = R.pipe(R.toPairs, R.chain(([key, val]) => {
    return (0, _is.isObject)(val) ? R.map(([k2, v2]) => [pred(key, k2), v2], flatPairs(val)) : [[key, val]];
  }));
  return R.fromPairs(flatPairs(obj));
});
exports.flattenWith = flattenWith;
const nestWith = R.curry((pred, obj) => {
  return R.reduce((obj, [key, val]) => {
    return R.assocPath(pred(key), val, obj);
  }, {}, R.toPairs(obj));
});
exports.nestWith = nestWith;

const toHumanJSON = obj => JSON.stringify(obj, null, 2);

exports.toHumanJSON = toHumanJSON;