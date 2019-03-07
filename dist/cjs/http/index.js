"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseContentType = void 0;

var _ramda = require("ramda");

const parseContentType = (0, _ramda.pipe)((0, _ramda.defaultTo)(''), (0, _ramda.split)(/;\s*/), (0, _ramda.chain)(str => {
  const [left, right] = str.split('=');
  if (!left && !right) return [];
  return right ? [[left, right]] : [['mimeType', left]];
}), _ramda.fromPairs);
exports.parseContentType = parseContentType;