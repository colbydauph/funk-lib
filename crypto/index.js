'use strict';

// core
const crypto = require('crypto');

// module
const R = require('ramda');

// string -> string -> string
const hashWith = R.curry((algo, str) => crypto
  .createHash(algo)
  .update(str)
  .digest('hex'));

// string -> string
const md5 = hashWith('md5');
// string -> string
const sha256 = hashWith('sha256');
// string -> string
const sha512 = hashWith('sha512');

module.exports = {
  md5,
  sha256,
  sha512,
};
