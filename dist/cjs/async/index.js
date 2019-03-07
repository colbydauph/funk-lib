"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeout = exports.TimeoutError = exports.props = exports.allSettledSeries = exports.allSettled = exports.filterSeries = exports.filter = exports.flatMapSeries = exports.flatMap = exports.findSeries = exports.find = exports.someSeries = exports.some = exports.everySeries = exports.every = exports.forEachSeries = exports.forEach = exports.mapPairsSeries = exports.mapPairs = exports.mapSeries = exports.map = exports.allSettledLimit = exports.filterLimit = exports.flatMapLimit = exports.findLimit = exports.someLimit = exports.everyLimit = exports.forEachLimit = exports.mapPairsLimit = exports.mapLimit = exports.pipeC = exports.pipe = exports.reduce = exports.deferred = exports.callbackify = exports.promisify = exports.fromCallback = exports.toAsync = exports.delay = exports.race = exports.all = void 0;

var R = _interopRequireWildcard(require("ramda"));

var _is = require("../is");

var _mapLimitCb = _interopRequireDefault(require("./map-limit-cb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const all = Promise.all.bind(Promise);
exports.all = all;
const race = Promise.race.bind(Promise);
exports.race = race;

const delay = async ms => new Promise(res => setTimeout(res, ms));

exports.delay = delay;

const toAsync = f => async (...args) => f(...args);

exports.toAsync = toAsync;

const fromCallback = async f => {
  return new Promise((resolve, reject) => {
    f((err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

exports.fromCallback = fromCallback;

const promisify = f => async (...args) => {
  return fromCallback(cb => f(...args, cb));
};

exports.promisify = promisify;

const callbackify = f => (...args) => {
  const cb = args.pop();
  toAsync(f)(...args).then(res => cb(null, res)).catch(err => cb(err));
};

exports.callbackify = callbackify;

const deferred = () => {
  let resolve, reject;
  return {
    promise: new Promise((...args) => {
      [resolve, reject] = args;
    }),
    resolve,
    reject
  };
};

exports.deferred = deferred;
const reduce = R.curry(async (f, acc, xs) => {
  for (const x of xs) acc = await f(acc, x);

  return acc;
});
exports.reduce = reduce;

const pipe = (f, ...fs) => async (...args) => {
  return reduce(R.applyTo, (await f(...args)), fs);
};

exports.pipe = pipe;

const pipeC = (...f) => R.curryN(f[0].length, pipe(...f));

exports.pipeC = pipeC;
const mapLimit = R.curry(async (limit, f, xs) => {
  if ((0, _is.isIterator)(xs)) xs = [...xs];
  let before = R.identity;
  let after = R.identity;
  let asyncF = f;

  if ((0, _is.isObject)(xs)) {
    before = R.toPairs;
    after = R.fromPairs;

    asyncF = async item => {
      const res = await f(item[1]);
      return [item[0], res];
    };
  }

  return promisify(_mapLimitCb.default)(before(xs), limit, callbackify(asyncF)).then(after);
});
exports.mapLimit = mapLimit;
const mapPairsLimit = R.curry(async (limit, f, object) => {
  return R.fromPairs((await mapLimit(limit, f, R.toPairs(object))));
});
exports.mapPairsLimit = mapPairsLimit;
const forEachLimit = R.curry(async (limit, f, xs) => {
  await mapLimit(limit, f, xs);
  return xs;
});
exports.forEachLimit = forEachLimit;
const everyLimit = R.curry(async (limit, f, xs) => {
  return new Promise(async resolve => {
    await forEachLimit(limit, async x => {
      if (!(await f(x))) resolve(false);
    }, xs);
    resolve(true);
  });
});
exports.everyLimit = everyLimit;
const someLimit = R.curry(async (limit, f, xs) => {
  return new Promise(async resolve => {
    await forEachLimit(limit, async x => {
      if (await f(x)) resolve(true);
    }, xs);
    resolve(false);
  });
});
exports.someLimit = someLimit;
const findLimit = R.curry(async (limit, f, xs) => {
  return new Promise(async (resolve, reject) => {
    await forEachLimit(limit, async x => {
      if (await f(x)) resolve(x);
    }, xs).then(() => resolve()).catch(reject);
  });
});
exports.findLimit = findLimit;
const flatMapLimit = pipeC(mapLimit, R.chain(R.identity));
exports.flatMapLimit = flatMapLimit;
const filterLimit = R.curry(async (limit, f, xs) => {
  return flatMapLimit(limit, async x => (await f(x)) ? [x] : [], xs);
});
exports.filterLimit = filterLimit;
const allSettledLimit = R.curry((limit, promises) => {
  return mapLimit(limit, promise => {
    return Promise.resolve(promise).then(value => ({
      status: 'fulfilled',
      value
    })).catch(reason => ({
      status: 'rejected',
      reason
    }));
  }, promises);
});
exports.allSettledLimit = allSettledLimit;
const map = mapLimit(Infinity);
exports.map = map;
const mapSeries = mapLimit(1);
exports.mapSeries = mapSeries;
const mapPairs = mapPairsLimit(Infinity);
exports.mapPairs = mapPairs;
const mapPairsSeries = mapPairsLimit(1);
exports.mapPairsSeries = mapPairsSeries;
const forEach = forEachLimit(Infinity);
exports.forEach = forEach;
const forEachSeries = forEachLimit(1);
exports.forEachSeries = forEachSeries;
const every = everyLimit(Infinity);
exports.every = every;
const everySeries = everyLimit(1);
exports.everySeries = everySeries;
const some = someLimit(Infinity);
exports.some = some;
const someSeries = someLimit(1);
exports.someSeries = someSeries;
const find = findLimit(Infinity);
exports.find = find;
const findSeries = findLimit(1);
exports.findSeries = findSeries;
const flatMap = flatMapLimit(Infinity);
exports.flatMap = flatMap;
const flatMapSeries = flatMapLimit(1);
exports.flatMapSeries = flatMapSeries;
const filter = filterLimit(Infinity);
exports.filter = filter;
const filterSeries = filterLimit(1);
exports.filterSeries = filterSeries;
const allSettled = allSettledLimit(Infinity);
exports.allSettled = allSettled;
const allSettledSeries = allSettledLimit(1);
exports.allSettledSeries = allSettledSeries;
const props = mapPairs(async ([key, val]) => [key, await val]);
exports.props = props;

class TimeoutError extends Error {}

exports.TimeoutError = TimeoutError;
const timeout = R.curry((ms, promise) => race([promise, delay(ms).then(() => {
  throw new TimeoutError(`Promise timed out after ${ms}ms`);
})]));
exports.timeout = timeout;