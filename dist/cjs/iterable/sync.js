"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "yieldWith", {
  enumerable: true,
  get: function () {
    return _yieldWith.yieldWith;
  }
});
exports.pad = exports.padTo = exports.indices = exports.corresponds = exports.correspondsWith = exports.isEmpty = exports.join = exports.joinWith = exports.intersperse = exports.unzip = exports.unzipN = exports.cycle = exports.cycleN = exports.flatten = exports.unnest = exports.flattenN = exports.partition = exports.splitAt = exports.splitEvery = exports.tee = exports.group = exports.groupWith = exports.includes = exports.indexOf = exports.init = exports.dropLast = exports.frame = exports.sort = exports.reverse = exports.dropWhile = exports.takeWhile = exports.exhaust = exports.findIndex = exports.find = exports.every = exports.none = exports.some = exports.nth = exports.toArray = exports.max = exports.min = exports.sum = exports.maxBy = exports.minBy = exports.sumBy = exports.count = exports.length = exports.times = exports.repeat = exports.tail = exports.drop = exports.take = exports.unique = exports.uniqueWith = exports.iterate = exports.unfold = exports.flatUnfold = exports.reject = exports.filter = exports.forEach = exports.append = exports.prepend = exports.concat = exports.slice = exports.accumulate = exports.enumerate = exports.range = exports.rangeStep = exports.zip = exports.zipWith = exports.zipWithN = exports.zipAll = exports.zipAllWith = exports.reduce = exports.scan = exports.of = exports.from = exports.map = exports.flatMap = exports.last = exports.next = exports.nextOr = void 0;

var R = _interopRequireWildcard(require("ramda"));

var _function = require("../function");

var _is = require("../is");

var _stopIteration = _interopRequireDefault(require("./stop-iteration"));

var _yieldWith = require("./yield-with");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const nextOr = R.curry((or, iterator) => {
  const {
    value,
    done
  } = iterator.next();
  return done ? or : value;
});
exports.nextOr = nextOr;

const next = iterator => {
  const err = new _stopIteration.default();
  const out = nextOr(err, iterator);
  if (out === err) throw err;
  return out;
};

exports.next = next;

const last = xs => {
  let last;

  for (const x of xs) last = x;

  return last;
};

exports.last = last;
const flatMap = R.curry(function* (f, xs) {
  for (const x of xs) yield* f(x);
});
exports.flatMap = flatMap;
const map = R.curry(function* (f, xs) {
  for (const x of xs) yield f(x);
});
exports.map = map;
const from = map(R.identity);
exports.from = from;
const of = R.unapply(from);
exports.of = of;
const scan = R.curry(function* (f, acc, xs) {
  yield acc;
  yield* map(x => acc = f(acc, x), xs);
});
exports.scan = scan;
const reduce = (0, _function.pipeC)(scan, last);
exports.reduce = reduce;
const zipAllWith = R.curry(function* (func, iterators) {
  iterators = R.map(from, iterators);

  while (true) {
    const {
      done,
      values
    } = R.reduce((out, iterator) => {
      if (out.done) return R.reduced(out);
      const {
        value,
        done
      } = iterator.next();
      return R.evolve({
        values: R.append(value),
        done: R.or(done)
      }, out);
    }, {
      done: false,
      values: []
    }, iterators);
    if (done) return;
    yield func(...values);
  }
});
exports.zipAllWith = zipAllWith;
const zipAll = zipAllWith(Array.of);
exports.zipAll = zipAll;

const zipWithN = n => R.curryN(n + 1)((f, ...iterables) => zipAllWith(f, iterables));

exports.zipWithN = zipWithN;
const zipWith = zipWithN(2);
exports.zipWith = zipWith;
const zip = zipWith(Array.of);
exports.zip = zip;
const rangeStep = R.curry(function* (step, start, stop) {
  if (step === 0) return;

  const cont = i => step > 0 ? i < stop : i > stop;

  for (let i = start; cont(i); i += step) yield i;
});
exports.rangeStep = rangeStep;
const range = rangeStep(1);
exports.range = range;

const enumerate = iterable => zip(range(0, Infinity), iterable);

exports.enumerate = enumerate;
const accumulate = R.curry((f, xs) => {
  let last;
  return map(([i, x]) => {
    return last = i ? f(last, x) : x;
  }, enumerate(xs));
});
exports.accumulate = accumulate;
const slice = R.curry(function* (start, stop, xs) {
  for (const [i, x] of enumerate(xs)) {
    if (i >= start) yield x;
    if (i >= stop - 1) return;
  }
});
exports.slice = slice;
const concat = R.curry(function* (xs1, xs2) {
  yield* xs1;
  yield* xs2;
});
exports.concat = concat;
const prepend = R.useWith(concat, [of, R.identity]);
exports.prepend = prepend;
const append = R.useWith(R.flip(concat), [of, R.identity]);
exports.append = append;
const forEach = R.curry(function* (f, xs) {
  for (const x of xs) f(x), yield x;
});
exports.forEach = forEach;
const filter = R.curry(function* (f, xs) {
  for (const x of xs) if (f(x)) yield x;
});
exports.filter = filter;
const reject = R.useWith(filter, [R.complement, R.identity]);
exports.reject = reject;
const flatUnfold = R.curry(function* (f, x) {
  do {
    x = yield* f(x);
  } while (x);
});
exports.flatUnfold = flatUnfold;
const unfold = R.curry(function* (f, x) {
  let pair = f(x);

  while (pair && pair.length) {
    yield pair[0];
    pair = f(pair[1]);
  }
});
exports.unfold = unfold;
const iterate = R.useWith(unfold, [f => x => [x, f(x)], R.identity]);
exports.iterate = iterate;
const uniqueWith = R.curry(function* (f, xs) {
  const seen = [];

  const add = saw => seen.push(saw);

  const has = item => seen.some(saw => f(item, saw));

  yield* filter(item => {
    if (has(item)) return false;
    add(item);
    return true;
  }, xs);
});
exports.uniqueWith = uniqueWith;

const unique = function* (xs) {
  const set = new Set();
  yield* filter(x => {
    if (set.has(x)) return;
    set.add(x);
    return true;
  }, xs);
};

exports.unique = unique;
const take = R.curry(function* (n, xs) {
  if (n <= 0) return;
  yield* slice(0, n, xs);
});
exports.take = take;
const drop = R.curry((n, iterable) => slice(n, Infinity, iterable));
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
const nth = R.curry((n, xs) => {
  for (const [i, x] of enumerate(xs)) {
    if (i === n) return x;
  }
});
exports.nth = nth;
const some = R.curry((f, xs) => {
  for (const x of xs) if (f(x)) return true;

  return false;
});
exports.some = some;
const none = R.complement(some);
exports.none = none;
const every = R.curry((f, xs) => {
  for (const x of xs) if (!f(x)) return false;

  return true;
});
exports.every = every;
const find = R.curry((f, xs) => {
  for (const x of xs) if (f(x)) return x;
});
exports.find = find;
const findIndex = R.curry((f, xs) => {
  for (const [i, x] of enumerate(xs)) {
    if (f(x)) return i;
  }

  return -1;
});
exports.findIndex = findIndex;

const exhaust = xs => {
  for (const _ of xs);
};

exports.exhaust = exhaust;
const takeWhile = R.curry(function* (f, xs) {
  for (const x of xs) {
    if (!f(x)) return;
    yield x;
  }
});
exports.takeWhile = takeWhile;
const dropWhile = R.curry(function* (f, xs) {
  xs = from(xs);

  for (const x of xs) {
    if (!f(x)) return yield* prepend(x, xs);
  }
});
exports.dropWhile = dropWhile;
const reverse = R.pipe(toArray, R.reverse);
exports.reverse = reverse;
const sort = R.useWith(R.sort, [R.identity, toArray]);
exports.sort = sort;
const frame = R.curry(function* (n, xs) {
  const cache = [];
  yield* flatMap(function* (x) {
    if (cache.length === n) {
      yield [...cache];
      cache.shift();
    }

    cache.push(x);
  }, xs);
  yield cache;
});
exports.frame = frame;
const dropLast = R.curry(function* (n, xs) {
  const done = new _stopIteration.default();

  for (const group of frame(n + 1, append(done, xs))) {
    if (R.last(group) === done) return;
    yield R.head(group);
  }
});
exports.dropLast = dropLast;
const init = dropLast(1);
exports.init = init;
const indexOf = R.useWith(findIndex, [_is.is, R.identity]);
exports.indexOf = indexOf;
const includes = R.useWith(some, [_is.is, R.identity]);
exports.includes = includes;
const groupWith = R.curry(function* (f, xs) {
  let last,
      group = [];
  yield* flatMap(function* ([i, x]) {
    if (i && !f(last, x)) {
      yield group;
      group = [];
    }

    group.push(last = x);
  }, enumerate(xs));
  if (group.length) yield group;
});
exports.groupWith = groupWith;
const group = groupWith(_is.is);
exports.group = group;
const tee = R.curry((n, xs) => {
  xs = from(xs);
  return [...Array(n)].map(() => []).map(function* (cache, _, caches) {
    while (true) {
      if (!cache.length) {
        const {
          done,
          value
        } = xs.next();
        if (done) return;

        for (const cache of caches) cache.push(value);
      }

      yield cache.shift();
    }
  });
});
exports.tee = tee;
const splitEvery = R.curry(function* (n, xs) {
  let group = [];
  yield* flatMap(function* (x) {
    group.push(x);
    if (group.length < n) return;
    yield group;
    group = [];
  }, xs);
  if (group.length) yield group;
});
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
  return flatMap(function* (x) {
    if (!(0, _is.isIterable)(x)) return yield x;
    yield* flattenN(n - 1, x);
  }, xs);
});
exports.flattenN = flattenN;
const unnest = flattenN(1);
exports.unnest = unnest;
const flatten = flattenN(Infinity);
exports.flatten = flatten;
const cycleN = R.curry(function* (n, xs) {
  if (n < 1) return;
  const buffer = [];
  yield* forEach(x => buffer.push(x), xs);

  while (n-- > 1) yield* buffer;
});
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
const isEmpty = none(_ => true);
exports.isEmpty = isEmpty;
const correspondsWith = R.useWith((pred, iterator1, iterator2) => {
  let done;

  do {
    const {
      done: done1,
      value: value1
    } = iterator1.next();
    const {
      done: done2,
      value: value2
    } = iterator2.next();
    if (done1 !== done2) return false;
    done = done1 && done2;
    if (!done && !pred(value1, value2)) return false;
  } while (!done);

  return true;
}, [R.identity, from, from]);
exports.correspondsWith = correspondsWith;
const corresponds = correspondsWith(_is.is);
exports.corresponds = corresponds;
const indices = R.pipe(enumerate, map(R.head));
exports.indices = indices;
const padTo = R.curry(function* (len, padder, xs) {
  let n = 0;
  yield* forEach(item => n++, xs);
  if (n < len) yield* times(len - n, padder);
});
exports.padTo = padTo;
const pad = padTo(Infinity);
exports.pad = pad;