'use strict';

// local
const array = require('./array');
const async = require('./async');
const color = require('./color');
const crypto = require('./crypto');
const datetime = require('./datetime');
const is = require('./is');
const number = require('./number');
const object = require('./object');
const proc = require('./process');
const stream = require('./stream');
const string = require('./string');
const uuid = require('./uuid');
const url = require('./url');

module.exports = {
  array,
  async,
  color,
  crypto,
  datetime,
  is,
  number,
  object,
  process: proc,
  stream,
  string,
  uuid,
  url,
};
