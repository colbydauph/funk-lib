function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import { deprecate } from 'util';
import * as R from 'ramda';
import { random } from "../number";
export var toObj = R.pipe(R.toPairs, R.fromPairs);
export var toObjBy = R.curryN(2)(deprecate(R.indexBy, 'funk-lib/object/toObjBy -> R.indexBy'));
export var sample = function sample(arr) {
  return arr[random(0, arr.length - 1)];
};
export var shuffle = function shuffle(arr) {
  arr = _toConsumableArray(arr);
  var j, x, i;

  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }

  return arr;
};