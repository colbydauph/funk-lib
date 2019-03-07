function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import * as R from 'ramda';
import { pipeC } from "../function";
import { is, isIterable } from "../is";
import StopIteration from "./stop-iteration";
export { yieldWith } from "./yield-with";
export var nextOr = R.curry(function (or, iterator) {
  var _iterator$next = iterator.next(),
      value = _iterator$next.value,
      done = _iterator$next.done;

  return done ? or : value;
});
export var next = function next(iterator) {
  var err = new StopIteration();
  var out = nextOr(err, iterator);
  if (out === err) throw err;
  return out;
};
export var last = function last(xs) {
  var last;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = xs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var x = _step.value;
      last = x;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return last;
};
export var flatMap = R.curry(regeneratorRuntime.mark(function _callee(f, xs) {
  var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, x;

  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 3;
          _iterator2 = xs[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 11;
            break;
          }

          x = _step2.value;
          return _context.delegateYield(f(x), "t0", 8);

        case 8:
          _iteratorNormalCompletion2 = true;
          _context.next = 5;
          break;

        case 11:
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t1 = _context["catch"](3);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t1;

        case 17:
          _context.prev = 17;
          _context.prev = 18;

          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }

        case 20:
          _context.prev = 20;

          if (!_didIteratorError2) {
            _context.next = 23;
            break;
          }

          throw _iteratorError2;

        case 23:
          return _context.finish(20);

        case 24:
          return _context.finish(17);

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[3, 13, 17, 25], [18,, 20, 24]]);
}));
export var map = R.curry(regeneratorRuntime.mark(function _callee2(f, xs) {
  var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, x;

  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context2.prev = 3;
          _iterator3 = xs[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context2.next = 12;
            break;
          }

          x = _step3.value;
          _context2.next = 9;
          return f(x);

        case 9:
          _iteratorNormalCompletion3 = true;
          _context2.next = 5;
          break;

        case 12:
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](3);
          _didIteratorError3 = true;
          _iteratorError3 = _context2.t0;

        case 18:
          _context2.prev = 18;
          _context2.prev = 19;

          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }

        case 21:
          _context2.prev = 21;

          if (!_didIteratorError3) {
            _context2.next = 24;
            break;
          }

          throw _iteratorError3;

        case 24:
          return _context2.finish(21);

        case 25:
          return _context2.finish(18);

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, null, [[3, 14, 18, 26], [19,, 21, 25]]);
}));
export var from = map(R.identity);
export var of = R.unapply(from);
export var scan = R.curry(regeneratorRuntime.mark(function _callee3(f, acc, xs) {
  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return acc;

        case 2:
          return _context3.delegateYield(map(function (x) {
            return acc = f(acc, x);
          }, xs), "t0", 3);

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3);
}));
export var reduce = pipeC(scan, last);
export var zipAllWith = R.curry(regeneratorRuntime.mark(function _callee4(func, iterators) {
  var _R$reduce, done, values;

  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          iterators = R.map(from, iterators);

        case 1:
          if (!true) {
            _context4.next = 9;
            break;
          }

          _R$reduce = R.reduce(function (out, iterator) {
            if (out.done) return R.reduced(out);

            var _iterator$next2 = iterator.next(),
                value = _iterator$next2.value,
                done = _iterator$next2.done;

            return R.evolve({
              values: R.append(value),
              done: R.or(done)
            }, out);
          }, {
            done: false,
            values: []
          }, iterators), done = _R$reduce.done, values = _R$reduce.values;

          if (!done) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return");

        case 5:
          _context4.next = 7;
          return func.apply(void 0, _toConsumableArray(values));

        case 7:
          _context4.next = 1;
          break;

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee4);
}));
export var zipAll = zipAllWith(Array.of);
export var zipWithN = function zipWithN(n) {
  return R.curryN(n + 1)(function (f) {
    for (var _len = arguments.length, iterables = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      iterables[_key - 1] = arguments[_key];
    }

    return zipAllWith(f, iterables);
  });
};
export var zipWith = zipWithN(2);
export var zip = zipWith(Array.of);
export var rangeStep = R.curry(regeneratorRuntime.mark(function _callee5(step, start, stop) {
  var cont, i;
  return regeneratorRuntime.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!(step === 0)) {
            _context5.next = 2;
            break;
          }

          return _context5.abrupt("return");

        case 2:
          cont = function cont(i) {
            return step > 0 ? i < stop : i > stop;
          };

          i = start;

        case 4:
          if (!cont(i)) {
            _context5.next = 10;
            break;
          }

          _context5.next = 7;
          return i;

        case 7:
          i += step;
          _context5.next = 4;
          break;

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, _callee5);
}));
export var range = rangeStep(1);
export var enumerate = function enumerate(iterable) {
  return zip(range(0, Infinity), iterable);
};
export var accumulate = R.curry(function (f, xs) {
  var last;
  return map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        i = _ref2[0],
        x = _ref2[1];

    return last = i ? f(last, x) : x;
  }, enumerate(xs));
});
export var slice = R.curry(regeneratorRuntime.mark(function _callee6(start, stop, xs) {
  var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _step4$value, i, x;

  return regeneratorRuntime.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context6.prev = 3;
          _iterator4 = enumerate(xs)[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context6.next = 15;
            break;
          }

          _step4$value = _slicedToArray(_step4.value, 2), i = _step4$value[0], x = _step4$value[1];

          if (!(i >= start)) {
            _context6.next = 10;
            break;
          }

          _context6.next = 10;
          return x;

        case 10:
          if (!(i >= stop - 1)) {
            _context6.next = 12;
            break;
          }

          return _context6.abrupt("return");

        case 12:
          _iteratorNormalCompletion4 = true;
          _context6.next = 5;
          break;

        case 15:
          _context6.next = 21;
          break;

        case 17:
          _context6.prev = 17;
          _context6.t0 = _context6["catch"](3);
          _didIteratorError4 = true;
          _iteratorError4 = _context6.t0;

        case 21:
          _context6.prev = 21;
          _context6.prev = 22;

          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }

        case 24:
          _context6.prev = 24;

          if (!_didIteratorError4) {
            _context6.next = 27;
            break;
          }

          throw _iteratorError4;

        case 27:
          return _context6.finish(24);

        case 28:
          return _context6.finish(21);

        case 29:
        case "end":
          return _context6.stop();
      }
    }
  }, _callee6, null, [[3, 17, 21, 29], [22,, 24, 28]]);
}));
export var concat = R.curry(regeneratorRuntime.mark(function _callee7(xs1, xs2) {
  return regeneratorRuntime.wrap(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          return _context7.delegateYield(xs1, "t0", 1);

        case 1:
          return _context7.delegateYield(xs2, "t1", 2);

        case 2:
        case "end":
          return _context7.stop();
      }
    }
  }, _callee7);
}));
export var prepend = R.useWith(concat, [of, R.identity]);
export var append = R.useWith(R.flip(concat), [of, R.identity]);
export var forEach = R.curry(regeneratorRuntime.mark(function _callee8(f, xs) {
  var _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, x;

  return regeneratorRuntime.wrap(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context8.prev = 3;
          _iterator5 = xs[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context8.next = 13;
            break;
          }

          x = _step5.value;
          f(x);
          _context8.next = 10;
          return x;

        case 10:
          _iteratorNormalCompletion5 = true;
          _context8.next = 5;
          break;

        case 13:
          _context8.next = 19;
          break;

        case 15:
          _context8.prev = 15;
          _context8.t0 = _context8["catch"](3);
          _didIteratorError5 = true;
          _iteratorError5 = _context8.t0;

        case 19:
          _context8.prev = 19;
          _context8.prev = 20;

          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }

        case 22:
          _context8.prev = 22;

          if (!_didIteratorError5) {
            _context8.next = 25;
            break;
          }

          throw _iteratorError5;

        case 25:
          return _context8.finish(22);

        case 26:
          return _context8.finish(19);

        case 27:
        case "end":
          return _context8.stop();
      }
    }
  }, _callee8, null, [[3, 15, 19, 27], [20,, 22, 26]]);
}));
export var filter = R.curry(regeneratorRuntime.mark(function _callee9(f, xs) {
  var _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, x;

  return regeneratorRuntime.wrap(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context9.prev = 3;
          _iterator6 = xs[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
            _context9.next = 13;
            break;
          }

          x = _step6.value;

          if (!f(x)) {
            _context9.next = 10;
            break;
          }

          _context9.next = 10;
          return x;

        case 10:
          _iteratorNormalCompletion6 = true;
          _context9.next = 5;
          break;

        case 13:
          _context9.next = 19;
          break;

        case 15:
          _context9.prev = 15;
          _context9.t0 = _context9["catch"](3);
          _didIteratorError6 = true;
          _iteratorError6 = _context9.t0;

        case 19:
          _context9.prev = 19;
          _context9.prev = 20;

          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }

        case 22:
          _context9.prev = 22;

          if (!_didIteratorError6) {
            _context9.next = 25;
            break;
          }

          throw _iteratorError6;

        case 25:
          return _context9.finish(22);

        case 26:
          return _context9.finish(19);

        case 27:
        case "end":
          return _context9.stop();
      }
    }
  }, _callee9, null, [[3, 15, 19, 27], [20,, 22, 26]]);
}));
export var reject = R.useWith(filter, [R.complement, R.identity]);
export var flatUnfold = R.curry(regeneratorRuntime.mark(function _callee10(f, x) {
  return regeneratorRuntime.wrap(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          return _context10.delegateYield(f(x), "t0", 1);

        case 1:
          x = _context10.t0;

        case 2:
          if (x) {
            _context10.next = 0;
            break;
          }

        case 3:
        case "end":
          return _context10.stop();
      }
    }
  }, _callee10);
}));
export var unfold = R.curry(regeneratorRuntime.mark(function _callee11(f, x) {
  var pair;
  return regeneratorRuntime.wrap(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          pair = f(x);

        case 1:
          if (!(pair && pair.length)) {
            _context11.next = 7;
            break;
          }

          _context11.next = 4;
          return pair[0];

        case 4:
          pair = f(pair[1]);
          _context11.next = 1;
          break;

        case 7:
        case "end":
          return _context11.stop();
      }
    }
  }, _callee11);
}));
export var iterate = R.useWith(unfold, [function (f) {
  return function (x) {
    return [x, f(x)];
  };
}, R.identity]);
export var uniqueWith = R.curry(regeneratorRuntime.mark(function _callee12(f, xs) {
  var seen, add, has;
  return regeneratorRuntime.wrap(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          seen = [];

          add = function add(saw) {
            return seen.push(saw);
          };

          has = function has(item) {
            return seen.some(function (saw) {
              return f(item, saw);
            });
          };

          return _context12.delegateYield(filter(function (item) {
            if (has(item)) return false;
            add(item);
            return true;
          }, xs), "t0", 4);

        case 4:
        case "end":
          return _context12.stop();
      }
    }
  }, _callee12);
}));
export var unique = regeneratorRuntime.mark(function unique(xs) {
  var set;
  return regeneratorRuntime.wrap(function unique$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          set = new Set();
          return _context13.delegateYield(filter(function (x) {
            if (set.has(x)) return;
            set.add(x);
            return true;
          }, xs), "t0", 2);

        case 2:
        case "end":
          return _context13.stop();
      }
    }
  }, unique);
});
export var take = R.curry(regeneratorRuntime.mark(function _callee13(n, xs) {
  return regeneratorRuntime.wrap(function _callee13$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          if (!(n <= 0)) {
            _context14.next = 2;
            break;
          }

          return _context14.abrupt("return");

        case 2:
          return _context14.delegateYield(slice(0, n, xs), "t0", 3);

        case 3:
        case "end":
          return _context14.stop();
      }
    }
  }, _callee13);
}));
export var drop = R.curry(function (n, iterable) {
  return slice(n, Infinity, iterable);
});
export var tail = drop(1);
export var repeat = iterate(R.identity);
export var times = R.useWith(take, [R.identity, repeat]);
export var length = reduce(R.add(1), 0);
export var count = pipeC(filter, length);
export var sumBy = pipeC(map, reduce(R.add, 0));
export var minBy = pipeC(map, reduce(Math.min, Infinity));
export var maxBy = pipeC(map, reduce(Math.max, -Infinity));
export var sum = sumBy(R.identity);
export var min = minBy(R.identity);
export var max = maxBy(R.identity);
export var toArray = reduce(R.flip(R.append), []);
export var nth = R.curry(function (n, xs) {
  var _iteratorNormalCompletion7 = true;
  var _didIteratorError7 = false;
  var _iteratorError7 = undefined;

  try {
    for (var _iterator7 = enumerate(xs)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
      var _step7$value = _slicedToArray(_step7.value, 2),
          i = _step7$value[0],
          x = _step7$value[1];

      if (i === n) return x;
    }
  } catch (err) {
    _didIteratorError7 = true;
    _iteratorError7 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
        _iterator7.return();
      }
    } finally {
      if (_didIteratorError7) {
        throw _iteratorError7;
      }
    }
  }
});
export var some = R.curry(function (f, xs) {
  var _iteratorNormalCompletion8 = true;
  var _didIteratorError8 = false;
  var _iteratorError8 = undefined;

  try {
    for (var _iterator8 = xs[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
      var x = _step8.value;
      if (f(x)) return true;
    }
  } catch (err) {
    _didIteratorError8 = true;
    _iteratorError8 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
        _iterator8.return();
      }
    } finally {
      if (_didIteratorError8) {
        throw _iteratorError8;
      }
    }
  }

  return false;
});
export var none = R.complement(some);
export var every = R.curry(function (f, xs) {
  var _iteratorNormalCompletion9 = true;
  var _didIteratorError9 = false;
  var _iteratorError9 = undefined;

  try {
    for (var _iterator9 = xs[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
      var x = _step9.value;
      if (!f(x)) return false;
    }
  } catch (err) {
    _didIteratorError9 = true;
    _iteratorError9 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
        _iterator9.return();
      }
    } finally {
      if (_didIteratorError9) {
        throw _iteratorError9;
      }
    }
  }

  return true;
});
export var find = R.curry(function (f, xs) {
  var _iteratorNormalCompletion10 = true;
  var _didIteratorError10 = false;
  var _iteratorError10 = undefined;

  try {
    for (var _iterator10 = xs[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
      var x = _step10.value;
      if (f(x)) return x;
    }
  } catch (err) {
    _didIteratorError10 = true;
    _iteratorError10 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
        _iterator10.return();
      }
    } finally {
      if (_didIteratorError10) {
        throw _iteratorError10;
      }
    }
  }
});
export var findIndex = R.curry(function (f, xs) {
  var _iteratorNormalCompletion11 = true;
  var _didIteratorError11 = false;
  var _iteratorError11 = undefined;

  try {
    for (var _iterator11 = enumerate(xs)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
      var _step11$value = _slicedToArray(_step11.value, 2),
          i = _step11$value[0],
          x = _step11$value[1];

      if (f(x)) return i;
    }
  } catch (err) {
    _didIteratorError11 = true;
    _iteratorError11 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
        _iterator11.return();
      }
    } finally {
      if (_didIteratorError11) {
        throw _iteratorError11;
      }
    }
  }

  return -1;
});
export var exhaust = function exhaust(xs) {
  var _iteratorNormalCompletion12 = true;
  var _didIteratorError12 = false;
  var _iteratorError12 = undefined;

  try {
    for (var _iterator12 = xs[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
      var _ = _step12.value;
      ;
    }
  } catch (err) {
    _didIteratorError12 = true;
    _iteratorError12 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
        _iterator12.return();
      }
    } finally {
      if (_didIteratorError12) {
        throw _iteratorError12;
      }
    }
  }
};
export var takeWhile = R.curry(regeneratorRuntime.mark(function _callee14(f, xs) {
  var _iteratorNormalCompletion13, _didIteratorError13, _iteratorError13, _iterator13, _step13, x;

  return regeneratorRuntime.wrap(function _callee14$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _iteratorNormalCompletion13 = true;
          _didIteratorError13 = false;
          _iteratorError13 = undefined;
          _context15.prev = 3;
          _iterator13 = xs[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done) {
            _context15.next = 14;
            break;
          }

          x = _step13.value;

          if (f(x)) {
            _context15.next = 9;
            break;
          }

          return _context15.abrupt("return");

        case 9:
          _context15.next = 11;
          return x;

        case 11:
          _iteratorNormalCompletion13 = true;
          _context15.next = 5;
          break;

        case 14:
          _context15.next = 20;
          break;

        case 16:
          _context15.prev = 16;
          _context15.t0 = _context15["catch"](3);
          _didIteratorError13 = true;
          _iteratorError13 = _context15.t0;

        case 20:
          _context15.prev = 20;
          _context15.prev = 21;

          if (!_iteratorNormalCompletion13 && _iterator13.return != null) {
            _iterator13.return();
          }

        case 23:
          _context15.prev = 23;

          if (!_didIteratorError13) {
            _context15.next = 26;
            break;
          }

          throw _iteratorError13;

        case 26:
          return _context15.finish(23);

        case 27:
          return _context15.finish(20);

        case 28:
        case "end":
          return _context15.stop();
      }
    }
  }, _callee14, null, [[3, 16, 20, 28], [21,, 23, 27]]);
}));
export var dropWhile = R.curry(regeneratorRuntime.mark(function _callee15(f, xs) {
  var _iteratorNormalCompletion14, _didIteratorError14, _iteratorError14, _iterator14, _step14, x;

  return regeneratorRuntime.wrap(function _callee15$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          xs = from(xs);
          _iteratorNormalCompletion14 = true;
          _didIteratorError14 = false;
          _iteratorError14 = undefined;
          _context16.prev = 4;
          _iterator14 = xs[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done) {
            _context16.next = 14;
            break;
          }

          x = _step14.value;

          if (f(x)) {
            _context16.next = 11;
            break;
          }

          return _context16.delegateYield(prepend(x, xs), "t0", 10);

        case 10:
          return _context16.abrupt("return", _context16.t0);

        case 11:
          _iteratorNormalCompletion14 = true;
          _context16.next = 6;
          break;

        case 14:
          _context16.next = 20;
          break;

        case 16:
          _context16.prev = 16;
          _context16.t1 = _context16["catch"](4);
          _didIteratorError14 = true;
          _iteratorError14 = _context16.t1;

        case 20:
          _context16.prev = 20;
          _context16.prev = 21;

          if (!_iteratorNormalCompletion14 && _iterator14.return != null) {
            _iterator14.return();
          }

        case 23:
          _context16.prev = 23;

          if (!_didIteratorError14) {
            _context16.next = 26;
            break;
          }

          throw _iteratorError14;

        case 26:
          return _context16.finish(23);

        case 27:
          return _context16.finish(20);

        case 28:
        case "end":
          return _context16.stop();
      }
    }
  }, _callee15, null, [[4, 16, 20, 28], [21,, 23, 27]]);
}));
export var reverse = R.pipe(toArray, R.reverse);
export var sort = R.useWith(R.sort, [R.identity, toArray]);
export var frame = R.curry(regeneratorRuntime.mark(function _callee17(n, xs) {
  var cache;
  return regeneratorRuntime.wrap(function _callee17$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          cache = [];
          return _context18.delegateYield(flatMap(regeneratorRuntime.mark(function _callee16(x) {
            return regeneratorRuntime.wrap(function _callee16$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    if (!(cache.length === n)) {
                      _context17.next = 4;
                      break;
                    }

                    _context17.next = 3;
                    return [].concat(cache);

                  case 3:
                    cache.shift();

                  case 4:
                    cache.push(x);

                  case 5:
                  case "end":
                    return _context17.stop();
                }
              }
            }, _callee16);
          }), xs), "t0", 2);

        case 2:
          _context18.next = 4;
          return cache;

        case 4:
        case "end":
          return _context18.stop();
      }
    }
  }, _callee17);
}));
export var dropLast = R.curry(regeneratorRuntime.mark(function _callee18(n, xs) {
  var done, _iteratorNormalCompletion15, _didIteratorError15, _iteratorError15, _iterator15, _step15, _group;

  return regeneratorRuntime.wrap(function _callee18$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          done = new StopIteration();
          _iteratorNormalCompletion15 = true;
          _didIteratorError15 = false;
          _iteratorError15 = undefined;
          _context19.prev = 4;
          _iterator15 = frame(n + 1, append(done, xs))[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done) {
            _context19.next = 15;
            break;
          }

          _group = _step15.value;

          if (!(R.last(_group) === done)) {
            _context19.next = 10;
            break;
          }

          return _context19.abrupt("return");

        case 10:
          _context19.next = 12;
          return R.head(_group);

        case 12:
          _iteratorNormalCompletion15 = true;
          _context19.next = 6;
          break;

        case 15:
          _context19.next = 21;
          break;

        case 17:
          _context19.prev = 17;
          _context19.t0 = _context19["catch"](4);
          _didIteratorError15 = true;
          _iteratorError15 = _context19.t0;

        case 21:
          _context19.prev = 21;
          _context19.prev = 22;

          if (!_iteratorNormalCompletion15 && _iterator15.return != null) {
            _iterator15.return();
          }

        case 24:
          _context19.prev = 24;

          if (!_didIteratorError15) {
            _context19.next = 27;
            break;
          }

          throw _iteratorError15;

        case 27:
          return _context19.finish(24);

        case 28:
          return _context19.finish(21);

        case 29:
        case "end":
          return _context19.stop();
      }
    }
  }, _callee18, null, [[4, 17, 21, 29], [22,, 24, 28]]);
}));
export var init = dropLast(1);
export var indexOf = R.useWith(findIndex, [is, R.identity]);
export var includes = R.useWith(some, [is, R.identity]);
export var groupWith = R.curry(regeneratorRuntime.mark(function _callee20(f, xs) {
  var last, group;
  return regeneratorRuntime.wrap(function _callee20$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          group = [];
          return _context21.delegateYield(flatMap(regeneratorRuntime.mark(function _callee19(_ref3) {
            var _ref4, i, x;

            return regeneratorRuntime.wrap(function _callee19$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    _ref4 = _slicedToArray(_ref3, 2), i = _ref4[0], x = _ref4[1];

                    if (!(i && !f(last, x))) {
                      _context20.next = 5;
                      break;
                    }

                    _context20.next = 4;
                    return group;

                  case 4:
                    group = [];

                  case 5:
                    group.push(last = x);

                  case 6:
                  case "end":
                    return _context20.stop();
                }
              }
            }, _callee19);
          }), enumerate(xs)), "t0", 2);

        case 2:
          if (!group.length) {
            _context21.next = 5;
            break;
          }

          _context21.next = 5;
          return group;

        case 5:
        case "end":
          return _context21.stop();
      }
    }
  }, _callee20);
}));
export var group = groupWith(is);
export var tee = R.curry(function (n, xs) {
  xs = from(xs);
  return _toConsumableArray(Array(n)).map(function () {
    return [];
  }).map(regeneratorRuntime.mark(function _callee21(cache, _, caches) {
    var _xs$next, done, value, _iteratorNormalCompletion16, _didIteratorError16, _iteratorError16, _iterator16, _step16, _cache;

    return regeneratorRuntime.wrap(function _callee21$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            if (!true) {
              _context22.next = 28;
              break;
            }

            if (cache.length) {
              _context22.next = 24;
              break;
            }

            _xs$next = xs.next(), done = _xs$next.done, value = _xs$next.value;

            if (!done) {
              _context22.next = 5;
              break;
            }

            return _context22.abrupt("return");

          case 5:
            _iteratorNormalCompletion16 = true;
            _didIteratorError16 = false;
            _iteratorError16 = undefined;
            _context22.prev = 8;

            for (_iterator16 = caches[Symbol.iterator](); !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
              _cache = _step16.value;

              _cache.push(value);
            }

            _context22.next = 16;
            break;

          case 12:
            _context22.prev = 12;
            _context22.t0 = _context22["catch"](8);
            _didIteratorError16 = true;
            _iteratorError16 = _context22.t0;

          case 16:
            _context22.prev = 16;
            _context22.prev = 17;

            if (!_iteratorNormalCompletion16 && _iterator16.return != null) {
              _iterator16.return();
            }

          case 19:
            _context22.prev = 19;

            if (!_didIteratorError16) {
              _context22.next = 22;
              break;
            }

            throw _iteratorError16;

          case 22:
            return _context22.finish(19);

          case 23:
            return _context22.finish(16);

          case 24:
            _context22.next = 26;
            return cache.shift();

          case 26:
            _context22.next = 0;
            break;

          case 28:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee21, null, [[8, 12, 16, 24], [17,, 19, 23]]);
  }));
});
export var splitEvery = R.curry(regeneratorRuntime.mark(function _callee23(n, xs) {
  var group;
  return regeneratorRuntime.wrap(function _callee23$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          group = [];
          return _context24.delegateYield(flatMap(regeneratorRuntime.mark(function _callee22(x) {
            return regeneratorRuntime.wrap(function _callee22$(_context23) {
              while (1) {
                switch (_context23.prev = _context23.next) {
                  case 0:
                    group.push(x);

                    if (!(group.length < n)) {
                      _context23.next = 3;
                      break;
                    }

                    return _context23.abrupt("return");

                  case 3:
                    _context23.next = 5;
                    return group;

                  case 5:
                    group = [];

                  case 6:
                  case "end":
                    return _context23.stop();
                }
              }
            }, _callee22);
          }), xs), "t0", 2);

        case 2:
          if (!group.length) {
            _context24.next = 5;
            break;
          }

          _context24.next = 5;
          return group;

        case 5:
        case "end":
          return _context24.stop();
      }
    }
  }, _callee23);
}));
export var splitAt = R.curry(function (n, xs) {
  var _tee = tee(2, xs),
      _tee2 = _slicedToArray(_tee, 2),
      it1 = _tee2[0],
      it2 = _tee2[1];

  return [take(n, it1), drop(n, it2)];
});
export var partition = R.curry(function (f, xs) {
  var _tee3 = tee(2, xs),
      _tee4 = _slicedToArray(_tee3, 2),
      pass = _tee4[0],
      fail = _tee4[1];

  return [filter(f, pass), reject(f, fail)];
});
export var flattenN = R.curry(function (n, xs) {
  if (n < 1) return xs;
  return flatMap(regeneratorRuntime.mark(function _callee24(x) {
    return regeneratorRuntime.wrap(function _callee24$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            if (isIterable(x)) {
              _context25.next = 4;
              break;
            }

            _context25.next = 3;
            return x;

          case 3:
            return _context25.abrupt("return", _context25.sent);

          case 4:
            return _context25.delegateYield(flattenN(n - 1, x), "t0", 5);

          case 5:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee24);
  }), xs);
});
export var unnest = flattenN(1);
export var flatten = flattenN(Infinity);
export var cycleN = R.curry(regeneratorRuntime.mark(function _callee25(n, xs) {
  var buffer;
  return regeneratorRuntime.wrap(function _callee25$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          if (!(n < 1)) {
            _context26.next = 2;
            break;
          }

          return _context26.abrupt("return");

        case 2:
          buffer = [];
          return _context26.delegateYield(forEach(function (x) {
            return buffer.push(x);
          }, xs), "t0", 4);

        case 4:
          if (!(n-- > 1)) {
            _context26.next = 8;
            break;
          }

          return _context26.delegateYield(buffer, "t1", 6);

        case 6:
          _context26.next = 4;
          break;

        case 8:
        case "end":
          return _context26.stop();
      }
    }
  }, _callee25);
}));
export var cycle = cycleN(Infinity);
export var unzipN = pipeC(tee, R.addIndex(R.map)(function (xs, i) {
  return map(nth(i), xs);
}));
export var unzip = unzipN(2);
export var intersperse = R.useWith(flatMap, [function (spacer) {
  return function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        i = _ref6[0],
        x = _ref6[1];

    return i ? [spacer, x] : [x];
  };
}, enumerate]);
export var joinWith = pipeC(intersperse, reduce(R.unapply(R.join('')), ''));
export var join = joinWith('');
export var isEmpty = none(function (_) {
  return true;
});
export var correspondsWith = R.useWith(function (pred, iterator1, iterator2) {
  var done;

  do {
    var _iterator1$next = iterator1.next(),
        done1 = _iterator1$next.done,
        value1 = _iterator1$next.value;

    var _iterator2$next = iterator2.next(),
        done2 = _iterator2$next.done,
        value2 = _iterator2$next.value;

    if (done1 !== done2) return false;
    done = done1 && done2;
    if (!done && !pred(value1, value2)) return false;
  } while (!done);

  return true;
}, [R.identity, from, from]);
export var corresponds = correspondsWith(is);
export var indices = R.pipe(enumerate, map(R.head));
export var padTo = R.curry(regeneratorRuntime.mark(function _callee26(len, padder, xs) {
  var n;
  return regeneratorRuntime.wrap(function _callee26$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          n = 0;
          return _context27.delegateYield(forEach(function (item) {
            return n++;
          }, xs), "t0", 2);

        case 2:
          if (!(n < len)) {
            _context27.next = 4;
            break;
          }

          return _context27.delegateYield(times(len - n, padder), "t1", 4);

        case 4:
        case "end":
          return _context27.stop();
      }
    }
  }, _callee26);
}));
export var pad = padTo(Infinity);