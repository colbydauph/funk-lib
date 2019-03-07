"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromString = exports.toString = void 0;

var _stream = require("stream");

const toString = async stream => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk.toString())).on('end', () => resolve(chunks.join(''))).on('error', reject);
  });
};

exports.toString = toString;

const fromString = string => {
  const stream = new _stream.Readable();

  stream._read = () => {};

  stream.push(string);
  stream.push(null);
  return stream;
};

exports.fromString = fromString;