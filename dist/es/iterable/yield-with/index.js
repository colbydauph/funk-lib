function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import * as R from 'ramda';
var yieldWith = R.curry(function (onYield, iterator) {
  var value, done;

  while (!done) {
    try {
      var _iterator$next = iterator.next(value);

      value = _iterator$next.value;
      done = _iterator$next.done;
      if (done) return value;
      value = onYield(value);
    } catch (err) {
      var _iterator$throw = iterator.throw(err);

      value = _iterator$throw.value;
      done = _iterator$throw.done;
      if (done) return value;
      value = onYield(value);
    }
  }
});
var yieldWithAsync = R.curry(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(onYield, iterator) {
    var value, done, _ref2, _ref3;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (done) {
              _context.next = 28;
              break;
            }

            _context.prev = 1;
            _context.next = 4;
            return iterator.next(value);

          case 4:
            _ref2 = _context.sent;
            value = _ref2.value;
            done = _ref2.done;

            if (!done) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", value);

          case 9:
            _context.next = 11;
            return onYield(value);

          case 11:
            value = _context.sent;
            _context.next = 26;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](1);
            _context.next = 18;
            return iterator.throw(_context.t0);

          case 18:
            _ref3 = _context.sent;
            value = _ref3.value;
            done = _ref3.done;

            if (!done) {
              _context.next = 23;
              break;
            }

            return _context.abrupt("return", value);

          case 23:
            _context.next = 25;
            return onYield(value);

          case 25:
            value = _context.sent;

          case 26:
            _context.next = 0;
            break;

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 14]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = {
  yieldWith: yieldWith,
  yieldWithAsync: yieldWithAsync
};