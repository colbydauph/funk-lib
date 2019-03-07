import { curry, curryN, pipe } from 'ramda';
export var pipeC = function pipeC() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return curryN(funcs[0].length, pipe.apply(void 0, funcs));
};
export var on = curry(function (bi, un, xa, ya) {
  return bi(un(xa), un(ya));
});
export var once = function once(fn) {
  var called = false;
  var res;
  return function () {
    if (called) return res;
    res = fn.apply(void 0, arguments);
    called = true;
    return res;
  };
};
export var noop = function noop() {};