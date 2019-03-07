"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDataUrl = exports.isDataUrl = void 0;

var _ramda = require("ramda");

const DATA_URL_REGEXP = /^data:([^;,]+)?(?:;([^,]+))?,(.+)$/;
const isDataUrl = (0, _ramda.test)(DATA_URL_REGEXP);
exports.isDataUrl = isDataUrl;

const parseDataUrl = url => {
  const [_, mediatype = 'text/plain;charset=US-ASCII', encoding, data] = DATA_URL_REGEXP.exec(url);
  const base64 = encoding === 'base64';
  return {
    mediatype,
    data,
    base64
  };
};

exports.parseDataUrl = parseDataUrl;