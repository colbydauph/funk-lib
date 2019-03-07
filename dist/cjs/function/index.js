"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = exports.once = exports.on = exports.pipeC = void 0;

var _ramda = require("ramda");

const pipeC = (...funcs) => (0, _ramda.curryN)(funcs[0].length, (0, _ramda.pipe)(...funcs));

exports.pipeC = pipeC;
const on = (0, _ramda.curry)((bi, un, xa, ya) => bi(un(xa), un(ya)));
exports.on = on;

const once = fn => {
  let called = false;
  let res;
  return (...args) => {
    if (called) return res;
    res = fn(...args);
    called = true;
    return res;
  };
};

exports.once = once;

const noop = () => {};

exports.noop = noop;