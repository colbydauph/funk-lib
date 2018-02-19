'use strict';

// core
const crypto = require('crypto');

// calculates the md5 hash of a string
// string -> string
const md5 = (str) => crypto
  .createHash('md5')
  .update(str)
  .digest('hex');

module.exports = {
  md5,
};
