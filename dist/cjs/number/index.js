"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.random = void 0;

var _ramda = require("ramda");

const random = (0, _ramda.useWith)((min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}, [(0, _ramda.max)(Number.MIN_SAFE_INTEGER), (0, _ramda.min)(Number.MAX_SAFE_INTEGER)]);
exports.random = random;