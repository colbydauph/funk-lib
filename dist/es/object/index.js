function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { deprecate } from 'util';
import * as R from 'ramda';
import { isObject } from "../is";
export var firstPair = R.pipe(R.toPairs, R.nth(0));
export var firstKey = R.pipe(firstPair, R.nth(0));
export var firstValue = R.pipe(firstPair, R.nth(1));
export var pickAs = R.curry(function (keyVals, obj) {
  return R.toPairs(keyVals).reduce(function (result, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    return R.assoc(val, obj[key], result);
  }, {});
});
export var mapPairs = R.curry(function (pred, obj) {
  return R.fromPairs(R.map(pred, R.toPairs(obj)));
});
export var mapKeys = R.curry(function (pred, obj) {
  return mapPairs(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];

    return [pred(key), value];
  }, obj);
});
export var mapValues = R.curryN(2)(deprecate(R.map, 'funk-lib/object/mapValues -> R.map'));
export var deepFreeze = function deepFreeze(obj) {
  Object.freeze(obj);
  R.forEach(deepFreeze, R.values(obj));
  return obj;
};
export var flattenWith = R.curry(function (pred, obj) {
  var flatPairs = R.pipe(R.toPairs, R.chain(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        val = _ref6[1];

    return isObject(val) ? R.map(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
          k2 = _ref8[0],
          v2 = _ref8[1];

      return [pred(key, k2), v2];
    }, flatPairs(val)) : [[key, val]];
  }));
  return R.fromPairs(flatPairs(obj));
});
export var nestWith = R.curry(function (pred, obj) {
  return R.reduce(function (obj, _ref9) {
    var _ref10 = _slicedToArray(_ref9, 2),
        key = _ref10[0],
        val = _ref10[1];

    return R.assocPath(pred(key), val, obj);
  }, {}, R.toPairs(obj));
});
export var toHumanJSON = function toHumanJSON(obj) {
  return JSON.stringify(obj, null, 2);
};