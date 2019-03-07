"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffle = exports.sample = exports.toObjBy = exports.toObj = void 0;

var _util = require("util");

var R = _interopRequireWildcard(require("ramda"));

var _number = require("../number");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const toObj = R.pipe(R.toPairs, R.fromPairs);
exports.toObj = toObj;
const toObjBy = R.curryN(2)((0, _util.deprecate)(R.indexBy, 'funk-lib/object/toObjBy -> R.indexBy'));
exports.toObjBy = toObjBy;

const sample = arr => arr[(0, _number.random)(0, arr.length - 1)];

exports.sample = sample;

const shuffle = arr => {
  arr = [...arr];
  let j, x, i;

  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }

  return arr;
};

exports.shuffle = shuffle;