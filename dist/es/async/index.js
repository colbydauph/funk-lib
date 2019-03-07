function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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

import * as R from 'ramda';
import { isObject, isIterator } from "../is";
import mapLimitCallback from "./map-limit-cb";
export var all = Promise.all.bind(Promise);
export var race = Promise.race.bind(Promise);
export var delay = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ms) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (res) {
              return setTimeout(res, ms);
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function delay(_x) {
    return _ref.apply(this, arguments);
  };
}();
export var toAsync = function toAsync(f) {
  return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", f.apply(void 0, _args2));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
};
export var fromCallback = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(f) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", new Promise(function (resolve, reject) {
              f(function (err, result) {
                if (err) return reject(err);
                return resolve(result);
              });
            }));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function fromCallback(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
export var promisify = function promisify(f) {
  return _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
    var _len,
        args,
        _key,
        _args4 = arguments;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            for (_len = _args4.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = _args4[_key];
            }

            return _context4.abrupt("return", fromCallback(function (cb) {
              return f.apply(void 0, args.concat([cb]));
            }));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
};
export var callbackify = function callbackify(f) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var cb = args.pop();
    toAsync(f).apply(void 0, args).then(function (res) {
      return cb(null, res);
    }).catch(function (err) {
      return cb(err);
    });
  };
};
export var deferred = function deferred() {
  var resolve, reject;
  return {
    promise: new Promise(function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      resolve = args[0];
      reject = args[1];
    }),
    resolve: resolve,
    reject: reject
  };
};
export var reduce = R.curry(function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(f, acc, xs) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, x;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context5.prev = 3;
            _iterator = xs[Symbol.iterator]();

          case 5:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context5.next = 13;
              break;
            }

            x = _step.value;
            _context5.next = 9;
            return f(acc, x);

          case 9:
            acc = _context5.sent;

          case 10:
            _iteratorNormalCompletion = true;
            _context5.next = 5;
            break;

          case 13:
            _context5.next = 19;
            break;

          case 15:
            _context5.prev = 15;
            _context5.t0 = _context5["catch"](3);
            _didIteratorError = true;
            _iteratorError = _context5.t0;

          case 19:
            _context5.prev = 19;
            _context5.prev = 20;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 22:
            _context5.prev = 22;

            if (!_didIteratorError) {
              _context5.next = 25;
              break;
            }

            throw _iteratorError;

          case 25:
            return _context5.finish(22);

          case 26:
            return _context5.finish(19);

          case 27:
            return _context5.abrupt("return", acc);

          case 28:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 15, 19, 27], [20,, 22, 26]]);
  }));

  return function (_x3, _x4, _x5) {
    return _ref5.apply(this, arguments);
  };
}());
export var pipe = function pipe(f) {
  for (var _len4 = arguments.length, fs = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    fs[_key4 - 1] = arguments[_key4];
  }

  return _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
    var _args6 = arguments;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.t0 = reduce;
            _context6.t1 = R.applyTo;
            _context6.next = 4;
            return f.apply(void 0, _args6);

          case 4:
            _context6.t2 = _context6.sent;
            _context6.t3 = fs;
            return _context6.abrupt("return", (0, _context6.t0)(_context6.t1, _context6.t2, _context6.t3));

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
};
export var pipeC = function pipeC() {
  for (var _len5 = arguments.length, f = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    f[_key5] = arguments[_key5];
  }

  return R.curryN(f[0].length, pipe.apply(void 0, f));
};
export var mapLimit = R.curry(function () {
  var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(limit, f, xs) {
    var before, after, asyncF;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (isIterator(xs)) xs = _toConsumableArray(xs);
            before = R.identity;
            after = R.identity;
            asyncF = f;

            if (isObject(xs)) {
              before = R.toPairs;
              after = R.fromPairs;

              asyncF = function () {
                var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(item) {
                  var res;
                  return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          _context7.next = 2;
                          return f(item[1]);

                        case 2:
                          res = _context7.sent;
                          return _context7.abrupt("return", [item[0], res]);

                        case 4:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7);
                }));

                return function asyncF(_x9) {
                  return _ref8.apply(this, arguments);
                };
              }();
            }

            return _context8.abrupt("return", promisify(mapLimitCallback)(before(xs), limit, callbackify(asyncF)).then(after));

          case 6:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x6, _x7, _x8) {
    return _ref7.apply(this, arguments);
  };
}());
export var mapPairsLimit = R.curry(function () {
  var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(limit, f, object) {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.t0 = R;
            _context9.next = 3;
            return mapLimit(limit, f, R.toPairs(object));

          case 3:
            _context9.t1 = _context9.sent;
            return _context9.abrupt("return", _context9.t0.fromPairs.call(_context9.t0, _context9.t1));

          case 5:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x10, _x11, _x12) {
    return _ref9.apply(this, arguments);
  };
}());
export var forEachLimit = R.curry(function () {
  var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(limit, f, xs) {
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return mapLimit(limit, f, xs);

          case 2:
            return _context10.abrupt("return", xs);

          case 3:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x13, _x14, _x15) {
    return _ref10.apply(this, arguments);
  };
}());
export var everyLimit = R.curry(function () {
  var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13(limit, f, xs) {
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            return _context13.abrupt("return", new Promise(function () {
              var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(resolve) {
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return forEachLimit(limit, function () {
                          var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(x) {
                            return regeneratorRuntime.wrap(function _callee11$(_context11) {
                              while (1) {
                                switch (_context11.prev = _context11.next) {
                                  case 0:
                                    _context11.next = 2;
                                    return f(x);

                                  case 2:
                                    if (_context11.sent) {
                                      _context11.next = 4;
                                      break;
                                    }

                                    resolve(false);

                                  case 4:
                                  case "end":
                                    return _context11.stop();
                                }
                              }
                            }, _callee11);
                          }));

                          return function (_x20) {
                            return _ref13.apply(this, arguments);
                          };
                        }(), xs);

                      case 2:
                        resolve(true);

                      case 3:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              }));

              return function (_x19) {
                return _ref12.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x16, _x17, _x18) {
    return _ref11.apply(this, arguments);
  };
}());
export var someLimit = R.curry(function () {
  var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee16(limit, f, xs) {
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            return _context16.abrupt("return", new Promise(function () {
              var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(resolve) {
                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        _context15.next = 2;
                        return forEachLimit(limit, function () {
                          var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(x) {
                            return regeneratorRuntime.wrap(function _callee14$(_context14) {
                              while (1) {
                                switch (_context14.prev = _context14.next) {
                                  case 0:
                                    _context14.next = 2;
                                    return f(x);

                                  case 2:
                                    if (!_context14.sent) {
                                      _context14.next = 4;
                                      break;
                                    }

                                    resolve(true);

                                  case 4:
                                  case "end":
                                    return _context14.stop();
                                }
                              }
                            }, _callee14);
                          }));

                          return function (_x25) {
                            return _ref16.apply(this, arguments);
                          };
                        }(), xs);

                      case 2:
                        resolve(false);

                      case 3:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15);
              }));

              return function (_x24) {
                return _ref15.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function (_x21, _x22, _x23) {
    return _ref14.apply(this, arguments);
  };
}());
export var findLimit = R.curry(function () {
  var _ref17 = _asyncToGenerator(regeneratorRuntime.mark(function _callee19(limit, f, xs) {
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            return _context19.abrupt("return", new Promise(function () {
              var _ref18 = _asyncToGenerator(regeneratorRuntime.mark(function _callee18(resolve, reject) {
                return regeneratorRuntime.wrap(function _callee18$(_context18) {
                  while (1) {
                    switch (_context18.prev = _context18.next) {
                      case 0:
                        _context18.next = 2;
                        return forEachLimit(limit, function () {
                          var _ref19 = _asyncToGenerator(regeneratorRuntime.mark(function _callee17(x) {
                            return regeneratorRuntime.wrap(function _callee17$(_context17) {
                              while (1) {
                                switch (_context17.prev = _context17.next) {
                                  case 0:
                                    _context17.next = 2;
                                    return f(x);

                                  case 2:
                                    if (!_context17.sent) {
                                      _context17.next = 4;
                                      break;
                                    }

                                    resolve(x);

                                  case 4:
                                  case "end":
                                    return _context17.stop();
                                }
                              }
                            }, _callee17);
                          }));

                          return function (_x31) {
                            return _ref19.apply(this, arguments);
                          };
                        }(), xs).then(function () {
                          return resolve();
                        }).catch(reject);

                      case 2:
                      case "end":
                        return _context18.stop();
                    }
                  }
                }, _callee18);
              }));

              return function (_x29, _x30) {
                return _ref18.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));

  return function (_x26, _x27, _x28) {
    return _ref17.apply(this, arguments);
  };
}());
export var flatMapLimit = pipeC(mapLimit, R.chain(R.identity));
export var filterLimit = R.curry(function () {
  var _ref20 = _asyncToGenerator(regeneratorRuntime.mark(function _callee21(limit, f, xs) {
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            return _context21.abrupt("return", flatMapLimit(limit, function () {
              var _ref21 = _asyncToGenerator(regeneratorRuntime.mark(function _callee20(x) {
                return regeneratorRuntime.wrap(function _callee20$(_context20) {
                  while (1) {
                    switch (_context20.prev = _context20.next) {
                      case 0:
                        _context20.next = 2;
                        return f(x);

                      case 2:
                        if (!_context20.sent) {
                          _context20.next = 6;
                          break;
                        }

                        _context20.t0 = [x];
                        _context20.next = 7;
                        break;

                      case 6:
                        _context20.t0 = [];

                      case 7:
                        return _context20.abrupt("return", _context20.t0);

                      case 8:
                      case "end":
                        return _context20.stop();
                    }
                  }
                }, _callee20);
              }));

              return function (_x35) {
                return _ref21.apply(this, arguments);
              };
            }(), xs));

          case 1:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));

  return function (_x32, _x33, _x34) {
    return _ref20.apply(this, arguments);
  };
}());
export var allSettledLimit = R.curry(function (limit, promises) {
  return mapLimit(limit, function (promise) {
    return Promise.resolve(promise).then(function (value) {
      return {
        status: 'fulfilled',
        value: value
      };
    }).catch(function (reason) {
      return {
        status: 'rejected',
        reason: reason
      };
    });
  }, promises);
});
export var map = mapLimit(Infinity);
export var mapSeries = mapLimit(1);
export var mapPairs = mapPairsLimit(Infinity);
export var mapPairsSeries = mapPairsLimit(1);
export var forEach = forEachLimit(Infinity);
export var forEachSeries = forEachLimit(1);
export var every = everyLimit(Infinity);
export var everySeries = everyLimit(1);
export var some = someLimit(Infinity);
export var someSeries = someLimit(1);
export var find = findLimit(Infinity);
export var findSeries = findLimit(1);
export var flatMap = flatMapLimit(Infinity);
export var flatMapSeries = flatMapLimit(1);
export var filter = filterLimit(Infinity);
export var filterSeries = filterLimit(1);
export var allSettled = allSettledLimit(Infinity);
export var allSettledSeries = allSettledLimit(1);
export var props = mapPairs(function () {
  var _ref23 = _asyncToGenerator(regeneratorRuntime.mark(function _callee22(_ref22) {
    var _ref24, key, val;

    return regeneratorRuntime.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _ref24 = _slicedToArray(_ref22, 2), key = _ref24[0], val = _ref24[1];
            _context22.t0 = key;
            _context22.next = 4;
            return val;

          case 4:
            _context22.t1 = _context22.sent;
            return _context22.abrupt("return", [_context22.t0, _context22.t1]);

          case 6:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));

  return function (_x36) {
    return _ref23.apply(this, arguments);
  };
}());
export var TimeoutError = function (_Error) {
  _inherits(TimeoutError, _Error);

  function TimeoutError() {
    _classCallCheck(this, TimeoutError);

    return _possibleConstructorReturn(this, _getPrototypeOf(TimeoutError).apply(this, arguments));
  }

  return TimeoutError;
}(_wrapNativeSuper(Error));
export var timeout = R.curry(function (ms, promise) {
  return race([promise, delay(ms).then(function () {
    throw new TimeoutError("Promise timed out after ".concat(ms, "ms"));
  })]);
});