function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume("next", arg); return; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } }

if (typeof Symbol === "function" && Symbol.asyncIterator) { _AsyncGenerator.prototype[Symbol.asyncIterator] = function () { return this; }; }

_AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };

_AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); };

_AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); };

function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

function _AwaitValue(value) { this.wrapped = value; }

function _asyncGeneratorDelegate(inner, awaitWrap) { var iter = {}, waiting = false; function pump(key, value) { waiting = true; value = new Promise(function (resolve) { resolve(inner[key](value)); }); return { done: false, value: awaitWrap(value) }; } ; if (typeof Symbol === "function" && Symbol.iterator) { iter[Symbol.iterator] = function () { return this; }; } iter.next = function (value) { if (waiting) { waiting = false; return value; } return pump("next", value); }; if (typeof inner.throw === "function") { iter.throw = function (value) { if (waiting) { waiting = false; throw value; } return pump("throw", value); }; } if (typeof inner.return === "function") { iter.return = function (value) { return pump("return", value); }; } return iter; }

function _asyncIterator(iterable) { var method; if (typeof Symbol === "function") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

import * as R from 'ramda';
import { pipeC } from "../function";
import { pipeC as asyncPipeC, reduce as reduceP } from "../async";
import { is, isIterable } from "../is";
import StopIteration from "./stop-iteration";
import 'core-js/modules/es7.symbol.async-iterator';
export { yieldWithAsync as yieldWith } from "./yield-with";

var complementP = function complementP(f) {
  return R.curryN(f.length)(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return f.apply(void 0, _args);

          case 2:
            return _context.abrupt("return", !_context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
};

export var nextOr = R.curry(function () {
  var _ref30 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(or, iterator) {
    var _ref31, value, done;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return iterator.next();

          case 2:
            _ref31 = _context2.sent;
            value = _ref31.value;
            done = _ref31.done;
            return _context2.abrupt("return", done ? or : value);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x56, _x57) {
    return _ref30.apply(this, arguments);
  };
}());
export var next = function () {
  var _ref32 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(iterator) {
    var err, out;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            err = new StopIteration();
            _context3.next = 3;
            return nextOr(err, iterator);

          case 3:
            out = _context3.sent;

            if (!(out === err)) {
              _context3.next = 6;
              break;
            }

            throw err;

          case 6:
            return _context3.abrupt("return", out);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function next(_x58) {
    return _ref32.apply(this, arguments);
  };
}();
export var last = function () {
  var _ref33 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(xs) {
    var last, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _context4.prev = 2;
            _iterator = _asyncIterator(xs);

          case 4:
            _context4.next = 6;
            return _iterator.next();

          case 6:
            _step = _context4.sent;
            _iteratorNormalCompletion = _step.done;
            _context4.next = 10;
            return _step.value;

          case 10:
            _value = _context4.sent;

            if (_iteratorNormalCompletion) {
              _context4.next = 17;
              break;
            }

            x = _value;
            last = x;

          case 14:
            _iteratorNormalCompletion = true;
            _context4.next = 4;
            break;

          case 17:
            _context4.next = 23;
            break;

          case 19:
            _context4.prev = 19;
            _context4.t0 = _context4["catch"](2);
            _didIteratorError = true;
            _iteratorError = _context4.t0;

          case 23:
            _context4.prev = 23;
            _context4.prev = 24;

            if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
              _context4.next = 28;
              break;
            }

            _context4.next = 28;
            return _iterator.return();

          case 28:
            _context4.prev = 28;

            if (!_didIteratorError) {
              _context4.next = 31;
              break;
            }

            throw _iteratorError;

          case 31:
            return _context4.finish(28);

          case 32:
            return _context4.finish(23);

          case 33:
            return _context4.abrupt("return", last);

          case 34:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 19, 23, 33], [24,, 28, 32]]);
  }));

  return function last(_x59) {
    return _ref33.apply(this, arguments);
  };
}();
export var flatMap = R.curry(function () {
  var _ref = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee5(f, xs) {
    var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, x;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _context5.prev = 2;
            _iterator2 = _asyncIterator(xs);

          case 4:
            _context5.next = 6;
            return _awaitAsyncGenerator(_iterator2.next());

          case 6:
            _step2 = _context5.sent;
            _iteratorNormalCompletion2 = _step2.done;
            _context5.next = 10;
            return _awaitAsyncGenerator(_step2.value);

          case 10:
            _value2 = _context5.sent;

            if (_iteratorNormalCompletion2) {
              _context5.next = 24;
              break;
            }

            x = _value2;
            _context5.t0 = _asyncGeneratorDelegate;
            _context5.t1 = _asyncIterator;
            _context5.next = 17;
            return _awaitAsyncGenerator(f(x));

          case 17:
            _context5.t2 = _context5.sent;
            _context5.t3 = (0, _context5.t1)(_context5.t2);
            _context5.t4 = _awaitAsyncGenerator;
            return _context5.delegateYield((0, _context5.t0)(_context5.t3, _context5.t4), "t5", 21);

          case 21:
            _iteratorNormalCompletion2 = true;
            _context5.next = 4;
            break;

          case 24:
            _context5.next = 30;
            break;

          case 26:
            _context5.prev = 26;
            _context5.t6 = _context5["catch"](2);
            _didIteratorError2 = true;
            _iteratorError2 = _context5.t6;

          case 30:
            _context5.prev = 30;
            _context5.prev = 31;

            if (!(!_iteratorNormalCompletion2 && _iterator2.return != null)) {
              _context5.next = 35;
              break;
            }

            _context5.next = 35;
            return _awaitAsyncGenerator(_iterator2.return());

          case 35:
            _context5.prev = 35;

            if (!_didIteratorError2) {
              _context5.next = 38;
              break;
            }

            throw _iteratorError2;

          case 38:
            return _context5.finish(35);

          case 39:
            return _context5.finish(30);

          case 40:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[2, 26, 30, 40], [31,, 35, 39]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
export var map = R.curry(function () {
  var _ref2 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee6(f, xs) {
    var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value3, x;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _context6.prev = 2;
            _iterator3 = _asyncIterator(xs);

          case 4:
            _context6.next = 6;
            return _awaitAsyncGenerator(_iterator3.next());

          case 6:
            _step3 = _context6.sent;
            _iteratorNormalCompletion3 = _step3.done;
            _context6.next = 10;
            return _awaitAsyncGenerator(_step3.value);

          case 10:
            _value3 = _context6.sent;

            if (_iteratorNormalCompletion3) {
              _context6.next = 18;
              break;
            }

            x = _value3;
            _context6.next = 15;
            return f(x);

          case 15:
            _iteratorNormalCompletion3 = true;
            _context6.next = 4;
            break;

          case 18:
            _context6.next = 24;
            break;

          case 20:
            _context6.prev = 20;
            _context6.t0 = _context6["catch"](2);
            _didIteratorError3 = true;
            _iteratorError3 = _context6.t0;

          case 24:
            _context6.prev = 24;
            _context6.prev = 25;

            if (!(!_iteratorNormalCompletion3 && _iterator3.return != null)) {
              _context6.next = 29;
              break;
            }

            _context6.next = 29;
            return _awaitAsyncGenerator(_iterator3.return());

          case 29:
            _context6.prev = 29;

            if (!_didIteratorError3) {
              _context6.next = 32;
              break;
            }

            throw _iteratorError3;

          case 32:
            return _context6.finish(29);

          case 33:
            return _context6.finish(24);

          case 34:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[2, 20, 24, 34], [25,, 29, 33]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
export var from = map(R.identity);
export var of = R.unapply(from);
export var scan = R.curry(function () {
  var _ref3 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee8(f, acc, xs) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return acc;

          case 2:
            return _context8.delegateYield(_asyncGeneratorDelegate(_asyncIterator(map(function () {
              var _ref34 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(x) {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return f(acc, x);

                      case 2:
                        return _context7.abrupt("return", acc = _context7.sent);

                      case 3:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x60) {
                return _ref34.apply(this, arguments);
              };
            }(), xs)), _awaitAsyncGenerator), "t0", 3);

          case 3:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}());
export var reduce = asyncPipeC(scan, last);
export var zipAllWith = R.curry(function () {
  var _ref4 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee10(func, iterators) {
    var _ref35, done, values;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            iterators = R.map(from, iterators);

          case 1:
            if (!true) {
              _context10.next = 13;
              break;
            }

            _context10.next = 4;
            return _awaitAsyncGenerator(reduceP(function () {
              var _ref36 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(out, iterator) {
                var _ref37, value, done;

                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        if (!out.done) {
                          _context9.next = 2;
                          break;
                        }

                        return _context9.abrupt("return", out);

                      case 2:
                        _context9.next = 4;
                        return iterator.next();

                      case 4:
                        _ref37 = _context9.sent;
                        value = _ref37.value;
                        done = _ref37.done;
                        return _context9.abrupt("return", R.evolve({
                          values: R.append(value),
                          done: R.or(done)
                        }, out));

                      case 8:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function (_x61, _x62) {
                return _ref36.apply(this, arguments);
              };
            }(), {
              done: false,
              values: []
            }, iterators));

          case 4:
            _ref35 = _context10.sent;
            done = _ref35.done;
            values = _ref35.values;

            if (!done) {
              _context10.next = 9;
              break;
            }

            return _context10.abrupt("return");

          case 9:
            _context10.next = 11;
            return func.apply(void 0, _toConsumableArray(values));

          case 11:
            _context10.next = 1;
            break;

          case 13:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}());
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
export var rangeStep = R.curry(function () {
  var _ref5 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee11(step, start, stop) {
    var cont, i;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            if (!(step === 0)) {
              _context11.next = 2;
              break;
            }

            return _context11.abrupt("return");

          case 2:
            cont = function cont(i) {
              return step > 0 ? i < stop : i > stop;
            };

            i = start;

          case 4:
            if (!cont(i)) {
              _context11.next = 10;
              break;
            }

            _context11.next = 7;
            return i;

          case 7:
            i += step;
            _context11.next = 4;
            break;

          case 10:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x10, _x11, _x12) {
    return _ref5.apply(this, arguments);
  };
}());
export var range = rangeStep(1);
export var enumerate = function enumerate(xs) {
  return zip(range(0, Infinity), xs);
};
export var accumulate = R.curry(function (f, xs) {
  var last;
  return map(function () {
    var _ref39 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(_ref38) {
      var _ref40, i, x;

      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _ref40 = _slicedToArray(_ref38, 2), i = _ref40[0], x = _ref40[1];

              if (!i) {
                _context12.next = 7;
                break;
              }

              _context12.next = 4;
              return f(last, x);

            case 4:
              _context12.t0 = _context12.sent;
              _context12.next = 8;
              break;

            case 7:
              _context12.t0 = x;

            case 8:
              return _context12.abrupt("return", last = _context12.t0);

            case 9:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    return function (_x63) {
      return _ref39.apply(this, arguments);
    };
  }(), enumerate(xs));
});
export var slice = R.curry(function () {
  var _ref6 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee13(start, stop, xs) {
    var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _value4, _value16, _value17, i, x;

    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _context13.prev = 2;
            _iterator4 = _asyncIterator(enumerate(xs));

          case 4:
            _context13.next = 6;
            return _awaitAsyncGenerator(_iterator4.next());

          case 6:
            _step4 = _context13.sent;
            _iteratorNormalCompletion4 = _step4.done;
            _context13.next = 10;
            return _awaitAsyncGenerator(_step4.value);

          case 10:
            _value4 = _context13.sent;

            if (_iteratorNormalCompletion4) {
              _context13.next = 21;
              break;
            }

            _value16 = _value4, _value17 = _slicedToArray(_value16, 2), i = _value17[0], x = _value17[1];

            if (!(i >= start)) {
              _context13.next = 16;
              break;
            }

            _context13.next = 16;
            return x;

          case 16:
            if (!(i >= stop - 1)) {
              _context13.next = 18;
              break;
            }

            return _context13.abrupt("return");

          case 18:
            _iteratorNormalCompletion4 = true;
            _context13.next = 4;
            break;

          case 21:
            _context13.next = 27;
            break;

          case 23:
            _context13.prev = 23;
            _context13.t0 = _context13["catch"](2);
            _didIteratorError4 = true;
            _iteratorError4 = _context13.t0;

          case 27:
            _context13.prev = 27;
            _context13.prev = 28;

            if (!(!_iteratorNormalCompletion4 && _iterator4.return != null)) {
              _context13.next = 32;
              break;
            }

            _context13.next = 32;
            return _awaitAsyncGenerator(_iterator4.return());

          case 32:
            _context13.prev = 32;

            if (!_didIteratorError4) {
              _context13.next = 35;
              break;
            }

            throw _iteratorError4;

          case 35:
            return _context13.finish(32);

          case 36:
            return _context13.finish(27);

          case 37:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[2, 23, 27, 37], [28,, 32, 36]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref6.apply(this, arguments);
  };
}());
export var concat = R.curry(function () {
  var _ref7 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee14(xs1, xs2) {
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            return _context14.delegateYield(_asyncGeneratorDelegate(_asyncIterator(xs1), _awaitAsyncGenerator), "t0", 1);

          case 1:
            return _context14.delegateYield(_asyncGeneratorDelegate(_asyncIterator(xs2), _awaitAsyncGenerator), "t1", 2);

          case 2:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x16, _x17) {
    return _ref7.apply(this, arguments);
  };
}());
export var prepend = R.useWith(concat, [of, R.identity]);
export var append = R.useWith(R.flip(concat), [of, R.identity]);
export var forEach = R.curry(function () {
  var _ref8 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee15(f, xs) {
    var _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _value5, x;

    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _iteratorNormalCompletion5 = true;
            _didIteratorError5 = false;
            _context15.prev = 2;
            _iterator5 = _asyncIterator(xs);

          case 4:
            _context15.next = 6;
            return _awaitAsyncGenerator(_iterator5.next());

          case 6:
            _step5 = _context15.sent;
            _iteratorNormalCompletion5 = _step5.done;
            _context15.next = 10;
            return _awaitAsyncGenerator(_step5.value);

          case 10:
            _value5 = _context15.sent;

            if (_iteratorNormalCompletion5) {
              _context15.next = 20;
              break;
            }

            x = _value5;
            _context15.next = 15;
            return _awaitAsyncGenerator(f(x));

          case 15:
            _context15.next = 17;
            return x;

          case 17:
            _iteratorNormalCompletion5 = true;
            _context15.next = 4;
            break;

          case 20:
            _context15.next = 26;
            break;

          case 22:
            _context15.prev = 22;
            _context15.t0 = _context15["catch"](2);
            _didIteratorError5 = true;
            _iteratorError5 = _context15.t0;

          case 26:
            _context15.prev = 26;
            _context15.prev = 27;

            if (!(!_iteratorNormalCompletion5 && _iterator5.return != null)) {
              _context15.next = 31;
              break;
            }

            _context15.next = 31;
            return _awaitAsyncGenerator(_iterator5.return());

          case 31:
            _context15.prev = 31;

            if (!_didIteratorError5) {
              _context15.next = 34;
              break;
            }

            throw _iteratorError5;

          case 34:
            return _context15.finish(31);

          case 35:
            return _context15.finish(26);

          case 36:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[2, 22, 26, 36], [27,, 31, 35]]);
  }));

  return function (_x18, _x19) {
    return _ref8.apply(this, arguments);
  };
}());
export var filter = R.curry(function () {
  var _ref9 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee16(f, xs) {
    var _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _value6, x;

    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _iteratorNormalCompletion6 = true;
            _didIteratorError6 = false;
            _context16.prev = 2;
            _iterator6 = _asyncIterator(xs);

          case 4:
            _context16.next = 6;
            return _awaitAsyncGenerator(_iterator6.next());

          case 6:
            _step6 = _context16.sent;
            _iteratorNormalCompletion6 = _step6.done;
            _context16.next = 10;
            return _awaitAsyncGenerator(_step6.value);

          case 10:
            _value6 = _context16.sent;

            if (_iteratorNormalCompletion6) {
              _context16.next = 21;
              break;
            }

            x = _value6;
            _context16.next = 15;
            return _awaitAsyncGenerator(f(x));

          case 15:
            if (!_context16.sent) {
              _context16.next = 18;
              break;
            }

            _context16.next = 18;
            return x;

          case 18:
            _iteratorNormalCompletion6 = true;
            _context16.next = 4;
            break;

          case 21:
            _context16.next = 27;
            break;

          case 23:
            _context16.prev = 23;
            _context16.t0 = _context16["catch"](2);
            _didIteratorError6 = true;
            _iteratorError6 = _context16.t0;

          case 27:
            _context16.prev = 27;
            _context16.prev = 28;

            if (!(!_iteratorNormalCompletion6 && _iterator6.return != null)) {
              _context16.next = 32;
              break;
            }

            _context16.next = 32;
            return _awaitAsyncGenerator(_iterator6.return());

          case 32:
            _context16.prev = 32;

            if (!_didIteratorError6) {
              _context16.next = 35;
              break;
            }

            throw _iteratorError6;

          case 35:
            return _context16.finish(32);

          case 36:
            return _context16.finish(27);

          case 37:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[2, 23, 27, 37], [28,, 32, 36]]);
  }));

  return function (_x20, _x21) {
    return _ref9.apply(this, arguments);
  };
}());
export var reject = R.useWith(filter, [complementP, R.identity]);
export var flatUnfold = R.curry(function () {
  var _ref10 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee17(f, x) {
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.t0 = _asyncGeneratorDelegate;
            _context17.t1 = _asyncIterator;
            _context17.next = 4;
            return _awaitAsyncGenerator(f(x));

          case 4:
            _context17.t2 = _context17.sent;
            _context17.t3 = (0, _context17.t1)(_context17.t2);
            _context17.t4 = _awaitAsyncGenerator;
            return _context17.delegateYield((0, _context17.t0)(_context17.t3, _context17.t4), "t5", 8);

          case 8:
            x = _context17.t5;

          case 9:
            if (x) {
              _context17.next = 0;
              break;
            }

          case 10:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function (_x22, _x23) {
    return _ref10.apply(this, arguments);
  };
}());
export var unfold = R.curry(function () {
  var _ref11 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee18(f, x) {
    var pair;
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return _awaitAsyncGenerator(f(x));

          case 2:
            pair = _context18.sent;

          case 3:
            if (!(pair && pair.length)) {
              _context18.next = 11;
              break;
            }

            _context18.next = 6;
            return pair[0];

          case 6:
            _context18.next = 8;
            return _awaitAsyncGenerator(f(pair[1]));

          case 8:
            pair = _context18.sent;
            _context18.next = 3;
            break;

          case 11:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function (_x24, _x25) {
    return _ref11.apply(this, arguments);
  };
}());
export var iterate = R.useWith(unfold, [function (f) {
  return function () {
    var _ref41 = _asyncToGenerator(regeneratorRuntime.mark(function _callee19(x) {
      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.t0 = x;
              _context19.next = 3;
              return f(x);

            case 3:
              _context19.t1 = _context19.sent;
              return _context19.abrupt("return", [_context19.t0, _context19.t1]);

            case 5:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    }));

    return function (_x64) {
      return _ref41.apply(this, arguments);
    };
  }();
}, R.identity]);
export var some = R.curry(function () {
  var _ref42 = _asyncToGenerator(regeneratorRuntime.mark(function _callee20(f, xs) {
    var _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _value7, x;

    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _iteratorNormalCompletion7 = true;
            _didIteratorError7 = false;
            _context20.prev = 2;
            _iterator7 = _asyncIterator(xs);

          case 4:
            _context20.next = 6;
            return _iterator7.next();

          case 6:
            _step7 = _context20.sent;
            _iteratorNormalCompletion7 = _step7.done;
            _context20.next = 10;
            return _step7.value;

          case 10:
            _value7 = _context20.sent;

            if (_iteratorNormalCompletion7) {
              _context20.next = 20;
              break;
            }

            x = _value7;
            _context20.next = 15;
            return f(x);

          case 15:
            if (!_context20.sent) {
              _context20.next = 17;
              break;
            }

            return _context20.abrupt("return", true);

          case 17:
            _iteratorNormalCompletion7 = true;
            _context20.next = 4;
            break;

          case 20:
            _context20.next = 26;
            break;

          case 22:
            _context20.prev = 22;
            _context20.t0 = _context20["catch"](2);
            _didIteratorError7 = true;
            _iteratorError7 = _context20.t0;

          case 26:
            _context20.prev = 26;
            _context20.prev = 27;

            if (!(!_iteratorNormalCompletion7 && _iterator7.return != null)) {
              _context20.next = 31;
              break;
            }

            _context20.next = 31;
            return _iterator7.return();

          case 31:
            _context20.prev = 31;

            if (!_didIteratorError7) {
              _context20.next = 34;
              break;
            }

            throw _iteratorError7;

          case 34:
            return _context20.finish(31);

          case 35:
            return _context20.finish(26);

          case 36:
            return _context20.abrupt("return", false);

          case 37:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, null, [[2, 22, 26, 36], [27,, 31, 35]]);
  }));

  return function (_x65, _x66) {
    return _ref42.apply(this, arguments);
  };
}());
export var none = complementP(some);
export var uniqueWith = R.curry(function () {
  var _ref12 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee23(f, xs) {
    var seen, add, has;
    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            seen = [];

            add = function add(saw) {
              return seen.push(saw);
            };

            has = function () {
              var _ref43 = _asyncToGenerator(regeneratorRuntime.mark(function _callee21(x) {
                return regeneratorRuntime.wrap(function _callee21$(_context21) {
                  while (1) {
                    switch (_context21.prev = _context21.next) {
                      case 0:
                        return _context21.abrupt("return", some(function (saw) {
                          return f(x, saw);
                        }, seen));

                      case 1:
                      case "end":
                        return _context21.stop();
                    }
                  }
                }, _callee21);
              }));

              return function has(_x67) {
                return _ref43.apply(this, arguments);
              };
            }();

            return _context23.delegateYield(_asyncGeneratorDelegate(_asyncIterator(filter(function () {
              var _ref44 = _asyncToGenerator(regeneratorRuntime.mark(function _callee22(x) {
                return regeneratorRuntime.wrap(function _callee22$(_context22) {
                  while (1) {
                    switch (_context22.prev = _context22.next) {
                      case 0:
                        _context22.next = 2;
                        return has(x);

                      case 2:
                        if (!_context22.sent) {
                          _context22.next = 4;
                          break;
                        }

                        return _context22.abrupt("return", false);

                      case 4:
                        add(x);
                        return _context22.abrupt("return", true);

                      case 6:
                      case "end":
                        return _context22.stop();
                    }
                  }
                }, _callee22);
              }));

              return function (_x68) {
                return _ref44.apply(this, arguments);
              };
            }(), xs)), _awaitAsyncGenerator), "t0", 4);

          case 4:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23);
  }));

  return function (_x26, _x27) {
    return _ref12.apply(this, arguments);
  };
}());
export var unique = function () {
  var _ref13 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee24(xs) {
    var set;
    return regeneratorRuntime.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            set = new Set();
            return _context24.delegateYield(_asyncGeneratorDelegate(_asyncIterator(filter(function (x) {
              if (set.has(x)) return;
              set.add(x);
              return true;
            }, xs)), _awaitAsyncGenerator), "t0", 2);

          case 2:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24);
  }));

  return function unique(_x28) {
    return _ref13.apply(this, arguments);
  };
}();
export var take = R.curry(function () {
  var _ref14 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee25(n, xs) {
    return regeneratorRuntime.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            if (!(n <= 0)) {
              _context25.next = 2;
              break;
            }

            return _context25.abrupt("return");

          case 2:
            return _context25.delegateYield(_asyncGeneratorDelegate(_asyncIterator(slice(0, n, xs)), _awaitAsyncGenerator), "t0", 3);

          case 3:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25);
  }));

  return function (_x29, _x30) {
    return _ref14.apply(this, arguments);
  };
}());
export var drop = R.curry(function (n, xs) {
  return slice(n, Infinity, xs);
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
export var nth = R.curry(function () {
  var _ref45 = _asyncToGenerator(regeneratorRuntime.mark(function _callee26(n, xs) {
    var _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, _value8, _value18, _value19, i, x;

    return regeneratorRuntime.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            _iteratorNormalCompletion8 = true;
            _didIteratorError8 = false;
            _context26.prev = 2;
            _iterator8 = _asyncIterator(enumerate(xs));

          case 4:
            _context26.next = 6;
            return _iterator8.next();

          case 6:
            _step8 = _context26.sent;
            _iteratorNormalCompletion8 = _step8.done;
            _context26.next = 10;
            return _step8.value;

          case 10:
            _value8 = _context26.sent;

            if (_iteratorNormalCompletion8) {
              _context26.next = 18;
              break;
            }

            _value18 = _value8, _value19 = _slicedToArray(_value18, 2), i = _value19[0], x = _value19[1];

            if (!(i === n)) {
              _context26.next = 15;
              break;
            }

            return _context26.abrupt("return", x);

          case 15:
            _iteratorNormalCompletion8 = true;
            _context26.next = 4;
            break;

          case 18:
            _context26.next = 24;
            break;

          case 20:
            _context26.prev = 20;
            _context26.t0 = _context26["catch"](2);
            _didIteratorError8 = true;
            _iteratorError8 = _context26.t0;

          case 24:
            _context26.prev = 24;
            _context26.prev = 25;

            if (!(!_iteratorNormalCompletion8 && _iterator8.return != null)) {
              _context26.next = 29;
              break;
            }

            _context26.next = 29;
            return _iterator8.return();

          case 29:
            _context26.prev = 29;

            if (!_didIteratorError8) {
              _context26.next = 32;
              break;
            }

            throw _iteratorError8;

          case 32:
            return _context26.finish(29);

          case 33:
            return _context26.finish(24);

          case 34:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26, null, [[2, 20, 24, 34], [25,, 29, 33]]);
  }));

  return function (_x69, _x70) {
    return _ref45.apply(this, arguments);
  };
}());
export var every = R.curry(function () {
  var _ref46 = _asyncToGenerator(regeneratorRuntime.mark(function _callee27(f, xs) {
    var _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, _value9, x;

    return regeneratorRuntime.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            _iteratorNormalCompletion9 = true;
            _didIteratorError9 = false;
            _context27.prev = 2;
            _iterator9 = _asyncIterator(xs);

          case 4:
            _context27.next = 6;
            return _iterator9.next();

          case 6:
            _step9 = _context27.sent;
            _iteratorNormalCompletion9 = _step9.done;
            _context27.next = 10;
            return _step9.value;

          case 10:
            _value9 = _context27.sent;

            if (_iteratorNormalCompletion9) {
              _context27.next = 20;
              break;
            }

            x = _value9;
            _context27.next = 15;
            return f(x);

          case 15:
            if (_context27.sent) {
              _context27.next = 17;
              break;
            }

            return _context27.abrupt("return", false);

          case 17:
            _iteratorNormalCompletion9 = true;
            _context27.next = 4;
            break;

          case 20:
            _context27.next = 26;
            break;

          case 22:
            _context27.prev = 22;
            _context27.t0 = _context27["catch"](2);
            _didIteratorError9 = true;
            _iteratorError9 = _context27.t0;

          case 26:
            _context27.prev = 26;
            _context27.prev = 27;

            if (!(!_iteratorNormalCompletion9 && _iterator9.return != null)) {
              _context27.next = 31;
              break;
            }

            _context27.next = 31;
            return _iterator9.return();

          case 31:
            _context27.prev = 31;

            if (!_didIteratorError9) {
              _context27.next = 34;
              break;
            }

            throw _iteratorError9;

          case 34:
            return _context27.finish(31);

          case 35:
            return _context27.finish(26);

          case 36:
            return _context27.abrupt("return", true);

          case 37:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27, null, [[2, 22, 26, 36], [27,, 31, 35]]);
  }));

  return function (_x71, _x72) {
    return _ref46.apply(this, arguments);
  };
}());
export var find = R.curry(function () {
  var _ref47 = _asyncToGenerator(regeneratorRuntime.mark(function _callee28(f, xs) {
    var _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, _value10, x;

    return regeneratorRuntime.wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            _iteratorNormalCompletion10 = true;
            _didIteratorError10 = false;
            _context28.prev = 2;
            _iterator10 = _asyncIterator(xs);

          case 4:
            _context28.next = 6;
            return _iterator10.next();

          case 6:
            _step10 = _context28.sent;
            _iteratorNormalCompletion10 = _step10.done;
            _context28.next = 10;
            return _step10.value;

          case 10:
            _value10 = _context28.sent;

            if (_iteratorNormalCompletion10) {
              _context28.next = 20;
              break;
            }

            x = _value10;
            _context28.next = 15;
            return f(x);

          case 15:
            if (!_context28.sent) {
              _context28.next = 17;
              break;
            }

            return _context28.abrupt("return", x);

          case 17:
            _iteratorNormalCompletion10 = true;
            _context28.next = 4;
            break;

          case 20:
            _context28.next = 26;
            break;

          case 22:
            _context28.prev = 22;
            _context28.t0 = _context28["catch"](2);
            _didIteratorError10 = true;
            _iteratorError10 = _context28.t0;

          case 26:
            _context28.prev = 26;
            _context28.prev = 27;

            if (!(!_iteratorNormalCompletion10 && _iterator10.return != null)) {
              _context28.next = 31;
              break;
            }

            _context28.next = 31;
            return _iterator10.return();

          case 31:
            _context28.prev = 31;

            if (!_didIteratorError10) {
              _context28.next = 34;
              break;
            }

            throw _iteratorError10;

          case 34:
            return _context28.finish(31);

          case 35:
            return _context28.finish(26);

          case 36:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28, null, [[2, 22, 26, 36], [27,, 31, 35]]);
  }));

  return function (_x73, _x74) {
    return _ref47.apply(this, arguments);
  };
}());
export var findIndex = R.curry(function () {
  var _ref48 = _asyncToGenerator(regeneratorRuntime.mark(function _callee29(f, xs) {
    var _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, _value11, _value20, _value21, i, x;

    return regeneratorRuntime.wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            _iteratorNormalCompletion11 = true;
            _didIteratorError11 = false;
            _context29.prev = 2;
            _iterator11 = _asyncIterator(enumerate(xs));

          case 4:
            _context29.next = 6;
            return _iterator11.next();

          case 6:
            _step11 = _context29.sent;
            _iteratorNormalCompletion11 = _step11.done;
            _context29.next = 10;
            return _step11.value;

          case 10:
            _value11 = _context29.sent;

            if (_iteratorNormalCompletion11) {
              _context29.next = 20;
              break;
            }

            _value20 = _value11, _value21 = _slicedToArray(_value20, 2), i = _value21[0], x = _value21[1];
            _context29.next = 15;
            return f(x);

          case 15:
            if (!_context29.sent) {
              _context29.next = 17;
              break;
            }

            return _context29.abrupt("return", i);

          case 17:
            _iteratorNormalCompletion11 = true;
            _context29.next = 4;
            break;

          case 20:
            _context29.next = 26;
            break;

          case 22:
            _context29.prev = 22;
            _context29.t0 = _context29["catch"](2);
            _didIteratorError11 = true;
            _iteratorError11 = _context29.t0;

          case 26:
            _context29.prev = 26;
            _context29.prev = 27;

            if (!(!_iteratorNormalCompletion11 && _iterator11.return != null)) {
              _context29.next = 31;
              break;
            }

            _context29.next = 31;
            return _iterator11.return();

          case 31:
            _context29.prev = 31;

            if (!_didIteratorError11) {
              _context29.next = 34;
              break;
            }

            throw _iteratorError11;

          case 34:
            return _context29.finish(31);

          case 35:
            return _context29.finish(26);

          case 36:
            return _context29.abrupt("return", -1);

          case 37:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29, null, [[2, 22, 26, 36], [27,, 31, 35]]);
  }));

  return function (_x75, _x76) {
    return _ref48.apply(this, arguments);
  };
}());
export var exhaust = function () {
  var _ref49 = _asyncToGenerator(regeneratorRuntime.mark(function _callee30(xs) {
    var _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, _value12, _;

    return regeneratorRuntime.wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            _iteratorNormalCompletion12 = true;
            _didIteratorError12 = false;
            _context30.prev = 2;
            _iterator12 = _asyncIterator(xs);

          case 4:
            _context30.next = 6;
            return _iterator12.next();

          case 6:
            _step12 = _context30.sent;
            _iteratorNormalCompletion12 = _step12.done;
            _context30.next = 10;
            return _step12.value;

          case 10:
            _value12 = _context30.sent;

            if (_iteratorNormalCompletion12) {
              _context30.next = 17;
              break;
            }

            _ = _value12;
            ;

          case 14:
            _iteratorNormalCompletion12 = true;
            _context30.next = 4;
            break;

          case 17:
            _context30.next = 23;
            break;

          case 19:
            _context30.prev = 19;
            _context30.t0 = _context30["catch"](2);
            _didIteratorError12 = true;
            _iteratorError12 = _context30.t0;

          case 23:
            _context30.prev = 23;
            _context30.prev = 24;

            if (!(!_iteratorNormalCompletion12 && _iterator12.return != null)) {
              _context30.next = 28;
              break;
            }

            _context30.next = 28;
            return _iterator12.return();

          case 28:
            _context30.prev = 28;

            if (!_didIteratorError12) {
              _context30.next = 31;
              break;
            }

            throw _iteratorError12;

          case 31:
            return _context30.finish(28);

          case 32:
            return _context30.finish(23);

          case 33:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30, null, [[2, 19, 23, 33], [24,, 28, 32]]);
  }));

  return function exhaust(_x77) {
    return _ref49.apply(this, arguments);
  };
}();
export var takeWhile = R.curry(function () {
  var _ref15 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee31(f, xs) {
    var _iteratorNormalCompletion13, _didIteratorError13, _iteratorError13, _iterator13, _step13, _value13, x;

    return regeneratorRuntime.wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            _iteratorNormalCompletion13 = true;
            _didIteratorError13 = false;
            _context31.prev = 2;
            _iterator13 = _asyncIterator(xs);

          case 4:
            _context31.next = 6;
            return _awaitAsyncGenerator(_iterator13.next());

          case 6:
            _step13 = _context31.sent;
            _iteratorNormalCompletion13 = _step13.done;
            _context31.next = 10;
            return _awaitAsyncGenerator(_step13.value);

          case 10:
            _value13 = _context31.sent;

            if (_iteratorNormalCompletion13) {
              _context31.next = 22;
              break;
            }

            x = _value13;
            _context31.next = 15;
            return _awaitAsyncGenerator(f(x));

          case 15:
            if (_context31.sent) {
              _context31.next = 17;
              break;
            }

            return _context31.abrupt("return");

          case 17:
            _context31.next = 19;
            return x;

          case 19:
            _iteratorNormalCompletion13 = true;
            _context31.next = 4;
            break;

          case 22:
            _context31.next = 28;
            break;

          case 24:
            _context31.prev = 24;
            _context31.t0 = _context31["catch"](2);
            _didIteratorError13 = true;
            _iteratorError13 = _context31.t0;

          case 28:
            _context31.prev = 28;
            _context31.prev = 29;

            if (!(!_iteratorNormalCompletion13 && _iterator13.return != null)) {
              _context31.next = 33;
              break;
            }

            _context31.next = 33;
            return _awaitAsyncGenerator(_iterator13.return());

          case 33:
            _context31.prev = 33;

            if (!_didIteratorError13) {
              _context31.next = 36;
              break;
            }

            throw _iteratorError13;

          case 36:
            return _context31.finish(33);

          case 37:
            return _context31.finish(28);

          case 38:
          case "end":
            return _context31.stop();
        }
      }
    }, _callee31, null, [[2, 24, 28, 38], [29,, 33, 37]]);
  }));

  return function (_x31, _x32) {
    return _ref15.apply(this, arguments);
  };
}());
export var dropWhile = R.curry(function () {
  var _ref16 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee32(f, xs) {
    var _iteratorNormalCompletion14, _didIteratorError14, _iteratorError14, _iterator14, _step14, _value14, x;

    return regeneratorRuntime.wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            xs = from(xs);
            _iteratorNormalCompletion14 = true;
            _didIteratorError14 = false;
            _context32.prev = 3;
            _iterator14 = _asyncIterator(xs);

          case 5:
            _context32.next = 7;
            return _awaitAsyncGenerator(_iterator14.next());

          case 7:
            _step14 = _context32.sent;
            _iteratorNormalCompletion14 = _step14.done;
            _context32.next = 11;
            return _awaitAsyncGenerator(_step14.value);

          case 11:
            _value14 = _context32.sent;

            if (_iteratorNormalCompletion14) {
              _context32.next = 22;
              break;
            }

            x = _value14;
            _context32.next = 16;
            return _awaitAsyncGenerator(f(x));

          case 16:
            if (_context32.sent) {
              _context32.next = 19;
              break;
            }

            return _context32.delegateYield(_asyncGeneratorDelegate(_asyncIterator(prepend(x, xs)), _awaitAsyncGenerator), "t0", 18);

          case 18:
            return _context32.abrupt("return", _context32.t0);

          case 19:
            _iteratorNormalCompletion14 = true;
            _context32.next = 5;
            break;

          case 22:
            _context32.next = 28;
            break;

          case 24:
            _context32.prev = 24;
            _context32.t1 = _context32["catch"](3);
            _didIteratorError14 = true;
            _iteratorError14 = _context32.t1;

          case 28:
            _context32.prev = 28;
            _context32.prev = 29;

            if (!(!_iteratorNormalCompletion14 && _iterator14.return != null)) {
              _context32.next = 33;
              break;
            }

            _context32.next = 33;
            return _awaitAsyncGenerator(_iterator14.return());

          case 33:
            _context32.prev = 33;

            if (!_didIteratorError14) {
              _context32.next = 36;
              break;
            }

            throw _iteratorError14;

          case 36:
            return _context32.finish(33);

          case 37:
            return _context32.finish(28);

          case 38:
          case "end":
            return _context32.stop();
        }
      }
    }, _callee32, null, [[3, 24, 28, 38], [29,, 33, 37]]);
  }));

  return function (_x33, _x34) {
    return _ref16.apply(this, arguments);
  };
}());
export var reverse = function () {
  var _ref17 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee33(xs) {
    return regeneratorRuntime.wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            _context33.t0 = _asyncGeneratorDelegate;
            _context33.t1 = _asyncIterator;
            _context33.next = 4;
            return _awaitAsyncGenerator(toArray(xs));

          case 4:
            _context33.t2 = _context33.sent.reverse();
            _context33.t3 = (0, _context33.t1)(_context33.t2);
            _context33.t4 = _awaitAsyncGenerator;
            return _context33.delegateYield((0, _context33.t0)(_context33.t3, _context33.t4), "t5", 8);

          case 8:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33);
  }));

  return function reverse(_x35) {
    return _ref17.apply(this, arguments);
  };
}();
export var sort = R.useWith(R.sort, [R.identity, toArray]);
export var frame = R.curry(function () {
  var _ref18 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee35(n, xs) {
    var cache;
    return regeneratorRuntime.wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            cache = [];
            return _context35.delegateYield(_asyncGeneratorDelegate(_asyncIterator(flatMap(function () {
              var _ref19 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee34(x) {
                return regeneratorRuntime.wrap(function _callee34$(_context34) {
                  while (1) {
                    switch (_context34.prev = _context34.next) {
                      case 0:
                        if (!(cache.length === n)) {
                          _context34.next = 4;
                          break;
                        }

                        _context34.next = 3;
                        return [].concat(cache);

                      case 3:
                        cache.shift();

                      case 4:
                        cache.push(x);

                      case 5:
                      case "end":
                        return _context34.stop();
                    }
                  }
                }, _callee34);
              }));

              return function (_x38) {
                return _ref19.apply(this, arguments);
              };
            }(), xs)), _awaitAsyncGenerator), "t0", 2);

          case 2:
            _context35.next = 4;
            return cache;

          case 4:
          case "end":
            return _context35.stop();
        }
      }
    }, _callee35);
  }));

  return function (_x36, _x37) {
    return _ref18.apply(this, arguments);
  };
}());
export var dropLast = R.curry(function () {
  var _ref20 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee36(n, xs) {
    var done, _iteratorNormalCompletion15, _didIteratorError15, _iteratorError15, _iterator15, _step15, _value15, _group;

    return regeneratorRuntime.wrap(function _callee36$(_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            done = new StopIteration();
            _iteratorNormalCompletion15 = true;
            _didIteratorError15 = false;
            _context36.prev = 3;
            _iterator15 = _asyncIterator(frame(n + 1, append(done, xs)));

          case 5:
            _context36.next = 7;
            return _awaitAsyncGenerator(_iterator15.next());

          case 7:
            _step15 = _context36.sent;
            _iteratorNormalCompletion15 = _step15.done;
            _context36.next = 11;
            return _awaitAsyncGenerator(_step15.value);

          case 11:
            _value15 = _context36.sent;

            if (_iteratorNormalCompletion15) {
              _context36.next = 21;
              break;
            }

            _group = _value15;

            if (!(R.last(_group) === done)) {
              _context36.next = 16;
              break;
            }

            return _context36.abrupt("return");

          case 16:
            _context36.next = 18;
            return R.head(_group);

          case 18:
            _iteratorNormalCompletion15 = true;
            _context36.next = 5;
            break;

          case 21:
            _context36.next = 27;
            break;

          case 23:
            _context36.prev = 23;
            _context36.t0 = _context36["catch"](3);
            _didIteratorError15 = true;
            _iteratorError15 = _context36.t0;

          case 27:
            _context36.prev = 27;
            _context36.prev = 28;

            if (!(!_iteratorNormalCompletion15 && _iterator15.return != null)) {
              _context36.next = 32;
              break;
            }

            _context36.next = 32;
            return _awaitAsyncGenerator(_iterator15.return());

          case 32:
            _context36.prev = 32;

            if (!_didIteratorError15) {
              _context36.next = 35;
              break;
            }

            throw _iteratorError15;

          case 35:
            return _context36.finish(32);

          case 36:
            return _context36.finish(27);

          case 37:
          case "end":
            return _context36.stop();
        }
      }
    }, _callee36, null, [[3, 23, 27, 37], [28,, 32, 36]]);
  }));

  return function (_x39, _x40) {
    return _ref20.apply(this, arguments);
  };
}());
export var init = dropLast(1);
export var indexOf = R.useWith(findIndex, [is, R.identity]);
export var includes = R.useWith(some, [is, R.identity]);
export var groupWith = R.curry(function () {
  var _ref21 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee38(f, xs) {
    var last, group;
    return regeneratorRuntime.wrap(function _callee38$(_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            group = [];
            return _context38.delegateYield(_asyncGeneratorDelegate(_asyncIterator(flatMap(function () {
              var _ref22 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee37(_ref50) {
                var _ref51, i, x;

                return regeneratorRuntime.wrap(function _callee37$(_context37) {
                  while (1) {
                    switch (_context37.prev = _context37.next) {
                      case 0:
                        _ref51 = _slicedToArray(_ref50, 2), i = _ref51[0], x = _ref51[1];
                        _context37.t0 = i;

                        if (!_context37.t0) {
                          _context37.next = 6;
                          break;
                        }

                        _context37.next = 5;
                        return _awaitAsyncGenerator(f(last, x));

                      case 5:
                        _context37.t0 = !_context37.sent;

                      case 6:
                        if (!_context37.t0) {
                          _context37.next = 10;
                          break;
                        }

                        _context37.next = 9;
                        return group;

                      case 9:
                        group = [];

                      case 10:
                        group.push(last = x);

                      case 11:
                      case "end":
                        return _context37.stop();
                    }
                  }
                }, _callee37);
              }));

              return function (_x43) {
                return _ref22.apply(this, arguments);
              };
            }(), enumerate(xs))), _awaitAsyncGenerator), "t0", 2);

          case 2:
            if (!group.length) {
              _context38.next = 5;
              break;
            }

            _context38.next = 5;
            return group;

          case 5:
          case "end":
            return _context38.stop();
        }
      }
    }, _callee38);
  }));

  return function (_x41, _x42) {
    return _ref21.apply(this, arguments);
  };
}());
export var group = groupWith(is);
export var tee = R.curry(function (n, xs) {
  xs = from(xs);
  return _toConsumableArray(Array(n)).map(function () {
    return [];
  }).map(function () {
    var _ref23 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee39(cache, i, caches) {
      var _ref52, done, value, _iteratorNormalCompletion16, _didIteratorError16, _iteratorError16, _iterator16, _step16, _cache;

      return regeneratorRuntime.wrap(function _callee39$(_context39) {
        while (1) {
          switch (_context39.prev = _context39.next) {
            case 0:
              if (!true) {
                _context39.next = 34;
                break;
              }

              if (cache.length) {
                _context39.next = 30;
                break;
              }

              _context39.next = 4;
              return _awaitAsyncGenerator(xs.next());

            case 4:
              _ref52 = _context39.sent;
              done = _ref52.done;
              value = _ref52.value;

              if (!done) {
                _context39.next = 11;
                break;
              }

              if (!cache.length) {
                _context39.next = 10;
                break;
              }

              return _context39.delegateYield(_asyncGeneratorDelegate(_asyncIterator(cache), _awaitAsyncGenerator), "t0", 10);

            case 10:
              return _context39.abrupt("return");

            case 11:
              _iteratorNormalCompletion16 = true;
              _didIteratorError16 = false;
              _iteratorError16 = undefined;
              _context39.prev = 14;

              for (_iterator16 = caches[Symbol.iterator](); !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                _cache = _step16.value;

                _cache.push(value);
              }

              _context39.next = 22;
              break;

            case 18:
              _context39.prev = 18;
              _context39.t1 = _context39["catch"](14);
              _didIteratorError16 = true;
              _iteratorError16 = _context39.t1;

            case 22:
              _context39.prev = 22;
              _context39.prev = 23;

              if (!_iteratorNormalCompletion16 && _iterator16.return != null) {
                _iterator16.return();
              }

            case 25:
              _context39.prev = 25;

              if (!_didIteratorError16) {
                _context39.next = 28;
                break;
              }

              throw _iteratorError16;

            case 28:
              return _context39.finish(25);

            case 29:
              return _context39.finish(22);

            case 30:
              _context39.next = 32;
              return cache.shift();

            case 32:
              _context39.next = 0;
              break;

            case 34:
            case "end":
              return _context39.stop();
          }
        }
      }, _callee39, null, [[14, 18, 22, 30], [23,, 25, 29]]);
    }));

    return function (_x44, _x45, _x46) {
      return _ref23.apply(this, arguments);
    };
  }());
});
export var splitEvery = R.curry(function () {
  var _ref24 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee41(n, xs) {
    var group;
    return regeneratorRuntime.wrap(function _callee41$(_context41) {
      while (1) {
        switch (_context41.prev = _context41.next) {
          case 0:
            group = [];
            return _context41.delegateYield(_asyncGeneratorDelegate(_asyncIterator(flatMap(function () {
              var _ref25 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee40(x) {
                return regeneratorRuntime.wrap(function _callee40$(_context40) {
                  while (1) {
                    switch (_context40.prev = _context40.next) {
                      case 0:
                        group.push(x);

                        if (!(group.length < n)) {
                          _context40.next = 3;
                          break;
                        }

                        return _context40.abrupt("return");

                      case 3:
                        _context40.next = 5;
                        return group;

                      case 5:
                        group = [];

                      case 6:
                      case "end":
                        return _context40.stop();
                    }
                  }
                }, _callee40);
              }));

              return function (_x49) {
                return _ref25.apply(this, arguments);
              };
            }(), xs)), _awaitAsyncGenerator), "t0", 2);

          case 2:
            if (!group.length) {
              _context41.next = 5;
              break;
            }

            _context41.next = 5;
            return group;

          case 5:
          case "end":
            return _context41.stop();
        }
      }
    }, _callee41);
  }));

  return function (_x47, _x48) {
    return _ref24.apply(this, arguments);
  };
}());
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
  return flatMap(function () {
    var _ref26 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee42(x) {
      return regeneratorRuntime.wrap(function _callee42$(_context42) {
        while (1) {
          switch (_context42.prev = _context42.next) {
            case 0:
              if (isIterable(x)) {
                _context42.next = 4;
                break;
              }

              _context42.next = 3;
              return x;

            case 3:
              return _context42.abrupt("return", _context42.sent);

            case 4:
              return _context42.delegateYield(_asyncGeneratorDelegate(_asyncIterator(flattenN(n - 1, x)), _awaitAsyncGenerator), "t0", 5);

            case 5:
            case "end":
              return _context42.stop();
          }
        }
      }, _callee42);
    }));

    return function (_x50) {
      return _ref26.apply(this, arguments);
    };
  }(), xs);
});
export var unnest = flattenN(1);
export var flatten = flattenN(Infinity);
export var cycleN = R.curry(function () {
  var _ref27 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee43(n, xs) {
    var buffer;
    return regeneratorRuntime.wrap(function _callee43$(_context43) {
      while (1) {
        switch (_context43.prev = _context43.next) {
          case 0:
            if (!(n < 1)) {
              _context43.next = 2;
              break;
            }

            return _context43.abrupt("return");

          case 2:
            buffer = [];
            return _context43.delegateYield(_asyncGeneratorDelegate(_asyncIterator(forEach(function (x) {
              return buffer.push(x);
            }, xs)), _awaitAsyncGenerator), "t0", 4);

          case 4:
            if (!(n-- > 1)) {
              _context43.next = 8;
              break;
            }

            return _context43.delegateYield(_asyncGeneratorDelegate(_asyncIterator(buffer), _awaitAsyncGenerator), "t1", 6);

          case 6:
            _context43.next = 4;
            break;

          case 8:
          case "end":
            return _context43.stop();
        }
      }
    }, _callee43);
  }));

  return function (_x51, _x52) {
    return _ref27.apply(this, arguments);
  };
}());
export var cycle = cycleN(Infinity);
export var unzipN = pipeC(tee, R.addIndex(R.map)(function (xs, i) {
  return map(nth(i), xs);
}));
export var unzip = unzipN(2);
export var intersperse = R.useWith(flatMap, [function (spacer) {
  return function (_ref53) {
    var _ref54 = _slicedToArray(_ref53, 2),
        i = _ref54[0],
        x = _ref54[1];

    return i ? [spacer, x] : [x];
  };
}, enumerate]);
export var joinWith = pipeC(intersperse, reduce(R.unapply(R.join('')), ''));
export var join = joinWith('');
export var isEmpty = none(R.T);
export var correspondsWith = R.useWith(function () {
  var _ref55 = _asyncToGenerator(regeneratorRuntime.mark(function _callee44(func, iterator1, iterator2) {
    var done, _ref56, done1, value1, _ref57, done2, value2;

    return regeneratorRuntime.wrap(function _callee44$(_context44) {
      while (1) {
        switch (_context44.prev = _context44.next) {
          case 0:
            _context44.next = 2;
            return iterator1.next();

          case 2:
            _ref56 = _context44.sent;
            done1 = _ref56.done;
            value1 = _ref56.value;
            _context44.next = 7;
            return iterator2.next();

          case 7:
            _ref57 = _context44.sent;
            done2 = _ref57.done;
            value2 = _ref57.value;

            if (!(done1 !== done2)) {
              _context44.next = 12;
              break;
            }

            return _context44.abrupt("return", false);

          case 12:
            done = done1 && done2;
            _context44.t0 = !done;

            if (!_context44.t0) {
              _context44.next = 18;
              break;
            }

            _context44.next = 17;
            return func(value1, value2);

          case 17:
            _context44.t0 = !_context44.sent;

          case 18:
            if (!_context44.t0) {
              _context44.next = 20;
              break;
            }

            return _context44.abrupt("return", false);

          case 20:
            if (!done) {
              _context44.next = 0;
              break;
            }

          case 21:
            return _context44.abrupt("return", true);

          case 22:
          case "end":
            return _context44.stop();
        }
      }
    }, _callee44);
  }));

  return function (_x78, _x79, _x80) {
    return _ref55.apply(this, arguments);
  };
}(), [R.identity, from, from]);
export var corresponds = correspondsWith(is);
export var indices = R.pipe(enumerate, map(R.head));
export var padTo = R.curry(function () {
  var _ref28 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee45(len, padder, xs) {
    var n;
    return regeneratorRuntime.wrap(function _callee45$(_context45) {
      while (1) {
        switch (_context45.prev = _context45.next) {
          case 0:
            n = 0;
            return _context45.delegateYield(_asyncGeneratorDelegate(_asyncIterator(forEach(function (x) {
              return n++;
            }, xs)), _awaitAsyncGenerator), "t0", 2);

          case 2:
            if (!(n < len)) {
              _context45.next = 4;
              break;
            }

            return _context45.delegateYield(_asyncGeneratorDelegate(_asyncIterator(times(len - n, padder)), _awaitAsyncGenerator), "t1", 4);

          case 4:
          case "end":
            return _context45.stop();
        }
      }
    }, _callee45);
  }));

  return function (_x53, _x54, _x55) {
    return _ref28.apply(this, arguments);
  };
}());
export var pad = padTo(Infinity);