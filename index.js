'use strict';

// local
const array = require('./array');
const async = require('./async');
const color = require('./color');
const crypto = require('./crypto');
const datetime = require('./datetime');
const func = require('./function');
const generator = require('./generator');
const is = require('./is');
const iterable = require('./iterable');
const number = require('./number');
const object = require('./object');
const proc = require('./process');
const stream = require('./stream');
const string = require('./string');
const url = require('./url');
const uuid = require('./uuid');

module.exports = {
  array,
  async,
  color,
  crypto,
  datetime,
  function: func,
  generator,
  is,
  iterable,
  number,
  object,
  process: proc,
  stream,
  string,
  url,
  uuid,
};
