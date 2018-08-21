'use strict';

// core
const crypto = require('crypto');

const R = require('ramda');

// calculates the hash of a string, by type name
const hashWith = R.curry((type, str) => crypto
  .createHash(type)
  .update(str)
  .digest('hex'));

// calculates the hash of a string
// string -> string
const md5 = hashWith('md5');
const sha256 = hashWith('sha256');
const sha512 = hashWith('sha512');

module.exports = {
  hashWith,
  md5,
  sha256,
  sha512,
};
