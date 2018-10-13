'use strict';

const R = require('ramda');

// curried R.pipe
const pipeC = (...funcs) => R.curryN(funcs[0].length)(R.pipe(...funcs));

module.exports = {
  pipeC,
};
