"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "yieldWith", {
  enumerable: true,
  get: function () {
    return _yieldWith.yieldWithAsync;
  }
});
exports.pad = exports.padTo = exports.indices = exports.corresponds = exports.correspondsWith = exports.isEmpty = exports.join = exports.joinWith = exports.intersperse = exports.unzip = exports.unzipN = exports.cycle = exports.cycleN = exports.flatten = exports.unnest = exports.flattenN = exports.partition = exports.splitAt = exports.splitEvery = exports.tee = exports.group = exports.groupWith = exports.includes = exports.indexOf = exports.init = exports.dropLast = exports.frame = exports.sort = exports.reverse = exports.dropWhile = exports.takeWhile = exports.exhaust = exports.findIndex = exports.find = exports.every = exports.nth = exports.toArray = exports.max = exports.min = exports.sum = exports.maxBy = exports.minBy = exports.sumBy = exports.count = exports.length = exports.times = exports.repeat = exports.tail = exports.drop = exports.take = exports.unique = exports.uniqueWith = exports.none = exports.some = exports.iterate = exports.unfold = exports.flatUnfold = exports.reject = exports.filter = exports.forEach = exports.append = exports.prepend = exports.concat = exports.slice = exports.accumulate = exports.enumerate = exports.range = exports.rangeStep = exports.zip = exports.zipWith = exports.zipWithN = exports.zipAll = exports.zipAllWith = exports.reduce = exports.scan = exports.of = exports.from = exports.map = exports.flatMap = exports.last = exports.next = exports.nextOr = void 0;

var R = _interopRequireWildcard(require("ramda"));

var _function = require("../function");

var _async = require("../async");

var _is = require("../is");

var _stopIteration = _interopRequireDefault(require("./stop-iteration"));

require("core-js/modules/es7.symbol.async-iterator");

var _yieldWith = require("./yield-with");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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

const complementP = f => R.curryN(f.length)(async (...args) => !(await f(...args)));

const nextOr = R.curry(async (or, iterator) => {
  const {
    value,
    done
  } = await iterator.next();
  return done ? or : value;
});
exports.nextOr = nextOr;

const next = async iterator => {
  const err = new _stopIteration.default();
  const out = await nextOr(err, iterator);
  if (out === err) throw err;
  return out;
};

exports.next = next;

const last = async xs => {
  let last;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;

  var _iteratorError;

  try {
    for (var _iterator = _asyncIterator(xs), _step, _value; _step = await _iterator.next(), _iteratorNormalCompletion = _step.done, _value = await _step.value, !_iteratorNormalCompletion; _iteratorNormalCompletion = true) {
      const x = _value;
      last = x;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        await _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return last;
};

exports.last = last;
const flatMap = R.curry(function () {
  var _ref = _wrapAsyncGenerator(function* (f, xs) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;

    var _iteratorError2;

    try {
      for (var _iterator2 = _asyncIterator(xs), _step2, _value2; _step2 = yield _awaitAsyncGenerator(_iterator2.next()), _iteratorNormalCompletion2 = _step2.done, _value2 = yield _awaitAsyncGenerator(_step2.value), !_iteratorNormalCompletion2; _iteratorNormalCompletion2 = true) {
        const x = _value2;
        yield* _asyncGeneratorDelegate(_asyncIterator((yield _awaitAsyncGenerator(f(x)))), _awaitAsyncGenerator);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          yield _awaitAsyncGenerator(_iterator2.return());
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
exports.flatMap = flatMap;
const map = R.curry(function () {
  var _ref2 = _wrapAsyncGenerator(function* (f, xs) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;

    var _iteratorError3;

    try {
      for (var _iterator3 = _asyncIterator(xs), _step3, _value3; _step3 = yield _awaitAsyncGenerator(_iterator3.next()), _iteratorNormalCompletion3 = _step3.done, _value3 = yield _awaitAsyncGenerator(_step3.value), !_iteratorNormalCompletion3; _iteratorNormalCompletion3 = true) {
        const x = _value3;
        yield f(x);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          yield _awaitAsyncGenerator(_iterator3.return());
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  });

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
exports.map = map;
const from = map(R.identity);
exports.from = from;
const of = R.unapply(from);
exports.of = of;
const scan = R.curry(function () {
  var _ref3 = _wrapAsyncGenerator(function* (f, acc, xs) {
    yield acc;
    yield* _asyncGeneratorDelegate(_asyncIterator(map(async x => acc = await f(acc, x), xs)), _awaitAsyncGenerator);
  });

  return function (_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}());
exports.scan = scan;
const reduce = (0, _async.pipeC)(scan, last);
exports.reduce = reduce;
const zipAllWith = R.curry(function () {
  var _ref4 = _wrapAsyncGenerator(function* (func, iterators) {
    iterators = R.map(from, iterators);

    while (true) {
      const {
        done,
        values
      } = yield _awaitAsyncGenerator((0, _async.reduce)(async (out, iterator) => {
        if (out.done) return out;
        const {
          value,
          done
        } = await iterator.next();
        return R.evolve({
          values: R.append(value),
          done: R.or(done)
        }, out);
      }, {
        done: false,
        values: []
      }, iterators));
      if (done) return;
      yield func(...values);
    }
  });

  return function (_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}());
exports.zipAllWith = zipAllWith;
const zipAll = zipAllWith(Array.of);
exports.zipAll = zipAll;

const zipWithN = n => R.curryN(n + 1)((f, ...iterables) => zipAllWith(f, iterables));

exports.zipWithN = zipWithN;
const zipWith = zipWithN(2);
exports.zipWith = zipWith;
const zip = zipWith(Array.of);
exports.zip = zip;
const rangeStep = R.curry(function () {
  var _ref5 = _wrapAsyncGenerator(function* (step, start, stop) {
    if (step === 0) return;

    const cont = i => step > 0 ? i < stop : i > stop;

    for (let i = start; cont(i); i += step) yield i;
  });

  return function (_x10, _x11, _x12) {
    return _ref5.apply(this, arguments);
  };
}());
exports.rangeStep = rangeStep;
const range = rangeStep(1);
exports.range = range;

const enumerate = xs => zip(range(0, Infinity), xs);

exports.enumerate = enumerate;
const accumulate = R.curry((f, xs) => {
  let last;
  return map(async ([i, x]) => {
    return last = i ? await f(last, x) : x;
  }, enumerate(xs));
});
exports.accumulate = accumulate;
const slice = R.curry(function () {
  var _ref6 = _wrapAsyncGenerator(function* (start, stop, xs) {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;

    var _iteratorError4;

    try {
      for (var _iterator4 = _asyncIterator(enumerate(xs)), _step4, _value4; _step4 = yield _awaitAsyncGenerator(_iterator4.next()), _iteratorNormalCompletion4 = _step4.done, _value4 = yield _awaitAsyncGenerator(_step4.value), !_iteratorNormalCompletion4; _iteratorNormalCompletion4 = true) {
        const [i, x] = _value4;
        if (i >= start) yield x;
        if (i >= stop - 1) return;
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
          yield _awaitAsyncGenerator(_iterator4.return());
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  });

  return function (_x13, _x14, _x15) {
    return _ref6.apply(this, arguments);
  };
}());
exports.slice = slice;
const concat = R.curry(function () {
  var _ref7 = _wrapAsyncGenerator(function* (xs1, xs2) {
    yield* _asyncGeneratorDelegate(_asyncIterator(xs1), _awaitAsyncGenerator);
    yield* _asyncGeneratorDelegate(_asyncIterator(xs2), _awaitAsyncGenerator);
  });

  return function (_x16, _x17) {
    return _ref7.apply(this, arguments);
  };
}());
exports.concat = concat;
const prepend = R.useWith(concat, [of, R.identity]);
exports.prepend = prepend;
const append = R.useWith(R.flip(concat), [of, R.identity]);
exports.append = append;
const forEach = R.curry(function () {
  var _ref8 = _wrapAsyncGenerator(function* (f, xs) {
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;

    var _iteratorError5;

    try {
      for (var _iterator5 = _asyncIterator(xs), _step5, _value5; _step5 = yield _awaitAsyncGenerator(_iterator5.next()), _iteratorNormalCompletion5 = _step5.done, _value5 = yield _awaitAsyncGenerator(_step5.value), !_iteratorNormalCompletion5; _iteratorNormalCompletion5 = true) {
        const x = _value5;
        yield _awaitAsyncGenerator(f(x)), yield x;
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
          yield _awaitAsyncGenerator(_iterator5.return());
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  });

  return function (_x18, _x19) {
    return _ref8.apply(this, arguments);
  };
}());
exports.forEach = forEach;
const filter = R.curry(function () {
  var _ref9 = _wrapAsyncGenerator(function* (f, xs) {
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;

    var _iteratorError6;

    try {
      for (var _iterator6 = _asyncIterator(xs), _step6, _value6; _step6 = yield _awaitAsyncGenerator(_iterator6.next()), _iteratorNormalCompletion6 = _step6.done, _value6 = yield _awaitAsyncGenerator(_step6.value), !_iteratorNormalCompletion6; _iteratorNormalCompletion6 = true) {
        const x = _value6;
        if (yield _awaitAsyncGenerator(f(x))) yield x;
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
          yield _awaitAsyncGenerator(_iterator6.return());
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  });

  return function (_x20, _x21) {
    return _ref9.apply(this, arguments);
  };
}());
exports.filter = filter;
const reject = R.useWith(filter, [complementP, R.identity]);
exports.reject = reject;
const flatUnfold = R.curry(function () {
  var _ref10 = _wrapAsyncGenerator(function* (f, x) {
    do {
      x = yield* _asyncGeneratorDelegate(_asyncIterator((yield _awaitAsyncGenerator(f(x)))), _awaitAsyncGenerator);
    } while (x);
  });

  return function (_x22, _x23) {
    return _ref10.apply(this, arguments);
  };
}());
exports.flatUnfold = flatUnfold;
const unfold = R.curry(function () {
  var _ref11 = _wrapAsyncGenerator(function* (f, x) {
    let pair = yield _awaitAsyncGenerator(f(x));

    while (pair && pair.length) {
      yield pair[0];
      pair = yield _awaitAsyncGenerator(f(pair[1]));
    }
  });

  return function (_x24, _x25) {
    return _ref11.apply(this, arguments);
  };
}());
exports.unfold = unfold;
const iterate = R.useWith(unfold, [f => async x => [x, await f(x)], R.identity]);
exports.iterate = iterate;
const some = R.curry(async (f, xs) => {
  var _iteratorNormalCompletion7 = true;
  var _didIteratorError7 = false;

  var _iteratorError7;

  try {
    for (var _iterator7 = _asyncIterator(xs), _step7, _value7; _step7 = await _iterator7.next(), _iteratorNormalCompletion7 = _step7.done, _value7 = await _step7.value, !_iteratorNormalCompletion7; _iteratorNormalCompletion7 = true) {
      const x = _value7;
      if (await f(x)) return true;
    }
  } catch (err) {
    _didIteratorError7 = true;
    _iteratorError7 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
        await _iterator7.return();
      }
    } finally {
      if (_didIteratorError7) {
        throw _iteratorError7;
      }
    }
  }

  return false;
});
exports.some = some;
const none = complementP(some);
exports.none = none;
const uniqueWith = R.curry(function () {
  var _ref12 = _wrapAsyncGenerator(function* (f, xs) {
    const seen = [];

    const add = saw => seen.push(saw);

    const has = async x => some(saw => f(x, saw), seen);

    yield* _asyncGeneratorDelegate(_asyncIterator(filter(async x => {
      if (await has(x)) return false;
      add(x);
      return true;
    }, xs)), _awaitAsyncGenerator);
  });

  return function (_x26, _x27) {
    return _ref12.apply(this, arguments);
  };
}());
exports.uniqueWith = uniqueWith;

const unique = function () {
  var _ref13 = _wrapAsyncGenerator(function* (xs) {
    const set = new Set();
    yield* _asyncGeneratorDelegate(_asyncIterator(filter(x => {
      if (set.has(x)) return;
      set.add(x);
      return true;
    }, xs)), _awaitAsyncGenerator);
  });

  return function unique(_x28) {
    return _ref13.apply(this, arguments);
  };
}();

exports.unique = unique;
const take = R.curry(function () {
  var _ref14 = _wrapAsyncGenerator(function* (n, xs) {
    if (n <= 0) return;
    yield* _asyncGeneratorDelegate(_asyncIterator(slice(0, n, xs)), _awaitAsyncGenerator);
  });

  return function (_x29, _x30) {
    return _ref14.apply(this, arguments);
  };
}());
exports.take = take;
const drop = R.curry((n, xs) => slice(n, Infinity, xs));
exports.drop = drop;
const tail = drop(1);
exports.tail = tail;
const repeat = iterate(R.identity);
exports.repeat = repeat;
const times = R.useWith(take, [R.identity, repeat]);
exports.times = times;
const length = reduce(R.add(1), 0);
exports.length = length;
const count = (0, _function.pipeC)(filter, length);
exports.count = count;
const sumBy = (0, _function.pipeC)(map, reduce(R.add, 0));
exports.sumBy = sumBy;
const minBy = (0, _function.pipeC)(map, reduce(Math.min, Infinity));
exports.minBy = minBy;
const maxBy = (0, _function.pipeC)(map, reduce(Math.max, -Infinity));
exports.maxBy = maxBy;
const sum = sumBy(R.identity);
exports.sum = sum;
const min = minBy(R.identity);
exports.min = min;
const max = maxBy(R.identity);
exports.max = max;
const toArray = reduce(R.flip(R.append), []);
exports.toArray = toArray;
const nth = R.curry(async (n, xs) => {
  var _iteratorNormalCompletion8 = true;
  var _didIteratorError8 = false;

  var _iteratorError8;

  try {
    for (var _iterator8 = _asyncIterator(enumerate(xs)), _step8, _value8; _step8 = await _iterator8.next(), _iteratorNormalCompletion8 = _step8.done, _value8 = await _step8.value, !_iteratorNormalCompletion8; _iteratorNormalCompletion8 = true) {
      const [i, x] = _value8;
      if (i === n) return x;
    }
  } catch (err) {
    _didIteratorError8 = true;
    _iteratorError8 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
        await _iterator8.return();
      }
    } finally {
      if (_didIteratorError8) {
        throw _iteratorError8;
      }
    }
  }
});
exports.nth = nth;
const every = R.curry(async (f, xs) => {
  var _iteratorNormalCompletion9 = true;
  var _didIteratorError9 = false;

  var _iteratorError9;

  try {
    for (var _iterator9 = _asyncIterator(xs), _step9, _value9; _step9 = await _iterator9.next(), _iteratorNormalCompletion9 = _step9.done, _value9 = await _step9.value, !_iteratorNormalCompletion9; _iteratorNormalCompletion9 = true) {
      const x = _value9;
      if (!(await f(x))) return false;
    }
  } catch (err) {
    _didIteratorError9 = true;
    _iteratorError9 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
        await _iterator9.return();
      }
    } finally {
      if (_didIteratorError9) {
        throw _iteratorError9;
      }
    }
  }

  return true;
});
exports.every = every;
const find = R.curry(async (f, xs) => {
  var _iteratorNormalCompletion10 = true;
  var _didIteratorError10 = false;

  var _iteratorError10;

  try {
    for (var _iterator10 = _asyncIterator(xs), _step10, _value10; _step10 = await _iterator10.next(), _iteratorNormalCompletion10 = _step10.done, _value10 = await _step10.value, !_iteratorNormalCompletion10; _iteratorNormalCompletion10 = true) {
      const x = _value10;
      if (await f(x)) return x;
    }
  } catch (err) {
    _didIteratorError10 = true;
    _iteratorError10 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
        await _iterator10.return();
      }
    } finally {
      if (_didIteratorError10) {
        throw _iteratorError10;
      }
    }
  }
});
exports.find = find;
const findIndex = R.curry(async (f, xs) => {
  var _iteratorNormalCompletion11 = true;
  var _didIteratorError11 = false;

  var _iteratorError11;

  try {
    for (var _iterator11 = _asyncIterator(enumerate(xs)), _step11, _value11; _step11 = await _iterator11.next(), _iteratorNormalCompletion11 = _step11.done, _value11 = await _step11.value, !_iteratorNormalCompletion11; _iteratorNormalCompletion11 = true) {
      const [i, x] = _value11;
      if (await f(x)) return i;
    }
  } catch (err) {
    _didIteratorError11 = true;
    _iteratorError11 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
        await _iterator11.return();
      }
    } finally {
      if (_didIteratorError11) {
        throw _iteratorError11;
      }
    }
  }

  return -1;
});
exports.findIndex = findIndex;

const exhaust = async xs => {
  var _iteratorNormalCompletion12 = true;
  var _didIteratorError12 = false;

  var _iteratorError12;

  try {
    for (var _iterator12 = _asyncIterator(xs), _step12, _value12; _step12 = await _iterator12.next(), _iteratorNormalCompletion12 = _step12.done, _value12 = await _step12.value, !_iteratorNormalCompletion12; _iteratorNormalCompletion12 = true) {
      const _ = _value12;
      ;
    }
  } catch (err) {
    _didIteratorError12 = true;
    _iteratorError12 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
        await _iterator12.return();
      }
    } finally {
      if (_didIteratorError12) {
        throw _iteratorError12;
      }
    }
  }
};

exports.exhaust = exhaust;
const takeWhile = R.curry(function () {
  var _ref15 = _wrapAsyncGenerator(function* (f, xs) {
    var _iteratorNormalCompletion13 = true;
    var _didIteratorError13 = false;

    var _iteratorError13;

    try {
      for (var _iterator13 = _asyncIterator(xs), _step13, _value13; _step13 = yield _awaitAsyncGenerator(_iterator13.next()), _iteratorNormalCompletion13 = _step13.done, _value13 = yield _awaitAsyncGenerator(_step13.value), !_iteratorNormalCompletion13; _iteratorNormalCompletion13 = true) {
        const x = _value13;
        if (!(yield _awaitAsyncGenerator(f(x)))) return;
        yield x;
      }
    } catch (err) {
      _didIteratorError13 = true;
      _iteratorError13 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion13 && _iterator13.return != null) {
          yield _awaitAsyncGenerator(_iterator13.return());
        }
      } finally {
        if (_didIteratorError13) {
          throw _iteratorError13;
        }
      }
    }
  });

  return function (_x31, _x32) {
    return _ref15.apply(this, arguments);
  };
}());
exports.takeWhile = takeWhile;
const dropWhile = R.curry(function () {
  var _ref16 = _wrapAsyncGenerator(function* (f, xs) {
    xs = from(xs);
    var _iteratorNormalCompletion14 = true;
    var _didIteratorError14 = false;

    var _iteratorError14;

    try {
      for (var _iterator14 = _asyncIterator(xs), _step14, _value14; _step14 = yield _awaitAsyncGenerator(_iterator14.next()), _iteratorNormalCompletion14 = _step14.done, _value14 = yield _awaitAsyncGenerator(_step14.value), !_iteratorNormalCompletion14; _iteratorNormalCompletion14 = true) {
        const x = _value14;
        if (!(yield _awaitAsyncGenerator(f(x)))) return yield* _asyncGeneratorDelegate(_asyncIterator(prepend(x, xs)), _awaitAsyncGenerator);
      }
    } catch (err) {
      _didIteratorError14 = true;
      _iteratorError14 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion14 && _iterator14.return != null) {
          yield _awaitAsyncGenerator(_iterator14.return());
        }
      } finally {
        if (_didIteratorError14) {
          throw _iteratorError14;
        }
      }
    }
  });

  return function (_x33, _x34) {
    return _ref16.apply(this, arguments);
  };
}());
exports.dropWhile = dropWhile;

const reverse = function () {
  var _ref17 = _wrapAsyncGenerator(function* (xs) {
    yield* _asyncGeneratorDelegate(_asyncIterator((yield _awaitAsyncGenerator(toArray(xs))).reverse()), _awaitAsyncGenerator);
  });

  return function reverse(_x35) {
    return _ref17.apply(this, arguments);
  };
}();

exports.reverse = reverse;
const sort = R.useWith(R.sort, [R.identity, toArray]);
exports.sort = sort;
const frame = R.curry(function () {
  var _ref18 = _wrapAsyncGenerator(function* (n, xs) {
    const cache = [];
    yield* _asyncGeneratorDelegate(_asyncIterator(flatMap(function () {
      var _ref19 = _wrapAsyncGenerator(function* (x) {
        if (cache.length === n) {
          yield [...cache];
          cache.shift();
        }

        cache.push(x);
      });

      return function (_x38) {
        return _ref19.apply(this, arguments);
      };
    }(), xs)), _awaitAsyncGenerator);
    yield cache;
  });

  return function (_x36, _x37) {
    return _ref18.apply(this, arguments);
  };
}());
exports.frame = frame;
const dropLast = R.curry(function () {
  var _ref20 = _wrapAsyncGenerator(function* (n, xs) {
    const done = new _stopIteration.default();
    var _iteratorNormalCompletion15 = true;
    var _didIteratorError15 = false;

    var _iteratorError15;

    try {
      for (var _iterator15 = _asyncIterator(frame(n + 1, append(done, xs))), _step15, _value15; _step15 = yield _awaitAsyncGenerator(_iterator15.next()), _iteratorNormalCompletion15 = _step15.done, _value15 = yield _awaitAsyncGenerator(_step15.value), !_iteratorNormalCompletion15; _iteratorNormalCompletion15 = true) {
        const group = _value15;
        if (R.last(group) === done) return;
        yield R.head(group);
      }
    } catch (err) {
      _didIteratorError15 = true;
      _iteratorError15 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion15 && _iterator15.return != null) {
          yield _awaitAsyncGenerator(_iterator15.return());
        }
      } finally {
        if (_didIteratorError15) {
          throw _iteratorError15;
        }
      }
    }
  });

  return function (_x39, _x40) {
    return _ref20.apply(this, arguments);
  };
}());
exports.dropLast = dropLast;
const init = dropLast(1);
exports.init = init;
const indexOf = R.useWith(findIndex, [_is.is, R.identity]);
exports.indexOf = indexOf;
const includes = R.useWith(some, [_is.is, R.identity]);
exports.includes = includes;
const groupWith = R.curry(function () {
  var _ref21 = _wrapAsyncGenerator(function* (f, xs) {
    let last,
        group = [];
    yield* _asyncGeneratorDelegate(_asyncIterator(flatMap(function () {
      var _ref22 = _wrapAsyncGenerator(function* ([i, x]) {
        if (i && !(yield _awaitAsyncGenerator(f(last, x)))) {
          yield group;
          group = [];
        }

        group.push(last = x);
      });

      return function (_x43) {
        return _ref22.apply(this, arguments);
      };
    }(), enumerate(xs))), _awaitAsyncGenerator);
    if (group.length) yield group;
  });

  return function (_x41, _x42) {
    return _ref21.apply(this, arguments);
  };
}());
exports.groupWith = groupWith;
const group = groupWith(_is.is);
exports.group = group;
const tee = R.curry((n, xs) => {
  xs = from(xs);
  return [...Array(n)].map(() => []).map(function () {
    var _ref23 = _wrapAsyncGenerator(function* (cache, i, caches) {
      while (true) {
        if (!cache.length) {
          const {
            done,
            value
          } = yield _awaitAsyncGenerator(xs.next());

          if (done) {
            if (cache.length) yield* _asyncGeneratorDelegate(_asyncIterator(cache), _awaitAsyncGenerator);
            return;
          }

          for (const cache of caches) cache.push(value);
        }

        yield cache.shift();
      }
    });

    return function (_x44, _x45, _x46) {
      return _ref23.apply(this, arguments);
    };
  }());
});
exports.tee = tee;
const splitEvery = R.curry(function () {
  var _ref24 = _wrapAsyncGenerator(function* (n, xs) {
    let group = [];
    yield* _asyncGeneratorDelegate(_asyncIterator(flatMap(function () {
      var _ref25 = _wrapAsyncGenerator(function* (x) {
        group.push(x);
        if (group.length < n) return;
        yield group;
        group = [];
      });

      return function (_x49) {
        return _ref25.apply(this, arguments);
      };
    }(), xs)), _awaitAsyncGenerator);
    if (group.length) yield group;
  });

  return function (_x47, _x48) {
    return _ref24.apply(this, arguments);
  };
}());
exports.splitEvery = splitEvery;
const splitAt = R.curry((n, xs) => {
  const [it1, it2] = tee(2, xs);
  return [take(n, it1), drop(n, it2)];
});
exports.splitAt = splitAt;
const partition = R.curry((f, xs) => {
  const [pass, fail] = tee(2, xs);
  return [filter(f, pass), reject(f, fail)];
});
exports.partition = partition;
const flattenN = R.curry((n, xs) => {
  if (n < 1) return xs;
  return flatMap(function () {
    var _ref26 = _wrapAsyncGenerator(function* (x) {
      if (!(0, _is.isIterable)(x)) return yield x;
      yield* _asyncGeneratorDelegate(_asyncIterator(flattenN(n - 1, x)), _awaitAsyncGenerator);
    });

    return function (_x50) {
      return _ref26.apply(this, arguments);
    };
  }(), xs);
});
exports.flattenN = flattenN;
const unnest = flattenN(1);
exports.unnest = unnest;
const flatten = flattenN(Infinity);
exports.flatten = flatten;
const cycleN = R.curry(function () {
  var _ref27 = _wrapAsyncGenerator(function* (n, xs) {
    if (n < 1) return;
    const buffer = [];
    yield* _asyncGeneratorDelegate(_asyncIterator(forEach(x => buffer.push(x), xs)), _awaitAsyncGenerator);

    while (n-- > 1) yield* _asyncGeneratorDelegate(_asyncIterator(buffer), _awaitAsyncGenerator);
  });

  return function (_x51, _x52) {
    return _ref27.apply(this, arguments);
  };
}());
exports.cycleN = cycleN;
const cycle = cycleN(Infinity);
exports.cycle = cycle;
const unzipN = (0, _function.pipeC)(tee, R.addIndex(R.map)((xs, i) => map(nth(i), xs)));
exports.unzipN = unzipN;
const unzip = unzipN(2);
exports.unzip = unzip;
const intersperse = R.useWith(flatMap, [spacer => ([i, x]) => i ? [spacer, x] : [x], enumerate]);
exports.intersperse = intersperse;
const joinWith = (0, _function.pipeC)(intersperse, reduce(R.unapply(R.join('')), ''));
exports.joinWith = joinWith;
const join = joinWith('');
exports.join = join;
const isEmpty = none(R.T);
exports.isEmpty = isEmpty;
const correspondsWith = R.useWith(async (func, iterator1, iterator2) => {
  let done;

  do {
    const {
      done: done1,
      value: value1
    } = await iterator1.next();
    const {
      done: done2,
      value: value2
    } = await iterator2.next();
    if (done1 !== done2) return false;
    done = done1 && done2;
    if (!done && !(await func(value1, value2))) return false;
  } while (!done);

  return true;
}, [R.identity, from, from]);
exports.correspondsWith = correspondsWith;
const corresponds = correspondsWith(_is.is);
exports.corresponds = corresponds;
const indices = R.pipe(enumerate, map(R.head));
exports.indices = indices;
const padTo = R.curry(function () {
  var _ref28 = _wrapAsyncGenerator(function* (len, padder, xs) {
    let n = 0;
    yield* _asyncGeneratorDelegate(_asyncIterator(forEach(x => n++, xs)), _awaitAsyncGenerator);
    if (n < len) yield* _asyncGeneratorDelegate(_asyncIterator(times(len - n, padder)), _awaitAsyncGenerator);
  });

  return function (_x53, _x54, _x55) {
    return _ref28.apply(this, arguments);
  };
}());
exports.padTo = padTo;
const pad = padTo(Infinity);
exports.pad = pad;