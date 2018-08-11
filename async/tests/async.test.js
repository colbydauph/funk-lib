'use strict';

// modules
const { expect } = require('chai');
const sinon = require('sinon');
const R = require('ramda');

// local
const { isPromise } = require('../../is');
const { random } = require('../../number');

// local
const {
  callbackify,
  deferred,
  delay,
  filter,
  filterSeries,
  flatMap,
  flatMapSeries,
  forEach,
  forEachSeries,
  fromCallback,
  map,
  mapSeries,
  pipe,
  promisify,
  props,
  race,
  reduce,
  timeout,
  TimeoutError,
  toAsync,
} = require('..');

const assertIsParallel = async (isParallel, func) => {
  const iterable = R.range(0, 20);
  const out = [];
  await func(async (i) => {
    await delay(random(1, 2));
    out.push(i);
  }, iterable);
  
  if (isParallel) {
    expect(out)
      .to.have.members(iterable)
      .but.not.to.have.ordered.members(iterable);
  } else {
    expect(out)
      .to.have.ordered.members(iterable);
  }
  
};

describe('async lib', () => {
  
  describe('callbackify', () => {
    
    it('should return a function', () => {
      expect(callbackify(() => {})).to.be.a('function');
    });
        
    describe('async', () => {
    
      it('should call the callback with the resolved promise value', (cb) => {
        const result = {};
        callbackify(async () => result)(1, 2, 3, (err, res) => {
          expect(res).to.equal(result);
          cb(err);
        });
      });
      
      it('should call the callback with the rejected promise error', (cb) => {
        const error = Error('oops');
        callbackify(async () => {
          throw error;
        })(1, 2, 3, (err) => {
          expect(err).to.equal(error);
          cb();
        });
      });
      
    });
    
    describe('sync', () => {
      
      it('should call the callback with the resolved promise value', (cb) => {
        const result = {};
        callbackify(() => result)(1, 2, 3, (err, res) => {
          expect(res).to.equal(result);
          cb(err);
        });
      });
      
      it('should call the callback with the rejected promise error', (cb) => {
        const error = Error('oops');
        callbackify(() => {
          throw error;
        })(1, 2, 3, (err) => {
          expect(err).to.equal(error);
          cb();
        });
      });
      
      // all callbacks are async
      it('should call callback asynchronously', () => {
        const stub = sinon.stub();
        callbackify(() => {})(1, stub);
        expect(stub.called).to.eql(false);
      });
      
    });
    
    it('should work on sync functions', (cb) => {
      const error = Error('oops');
      callbackify(() => {
        throw error;
      })(1, 2, 3, (err) => {
        expect(err).to.equal(error);
        cb();
      });
    });
    
  });
  
  describe('delay', () => {
    
    it('should resolve after n ms', async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      expect(end - start).to.be.closeTo(100, 10);
    });
    
  });
  
  describe('deferred', () => {
    
    let promise, resolve, reject;
    beforeEach('', () => {
      ({ promise, resolve, reject } = deferred());
    });
    
    it('should create an externally resolved promise', async () => {
      const res = {};
      resolve(res);
      const out = await promise;
      expect(out).to.equal(res);
    });
    
    it('should create an externally rejected promise', async () => {
      const err = Error('oops');
      reject(err);
      await expect(promise).to.be.rejectedWith(err);
    });
    
  });
  
  describe('filter', () => {
    
    let pred, iterable;
    beforeEach(() => {
      pred = async num => num > 5;
      iterable = R.range(0, 10);
    });
    
    it('should filter by predicate', async () => {
      await expect(filter(pred, iterable))
        .to.eventually.eql([6, 7, 8, 9]);
    });
    
    it('should run in parallel', async () => {
      await assertIsParallel(true, filter);
    });
    
    it('should propagate errors', async () => {
      const error = Error('woops');
      pred = () => {
        throw error;
      };
      await expect(filter(pred, iterable))
        .to.eventually.be.rejectedWith(error);
    });
    
    it('should be curried', async () => {
      await expect(filter(pred)(iterable))
        .to.eventually.eql([6, 7, 8, 9]);
    });
    
  });
  
  describe('filterSeries', () => {
    
    let pred, iterable;
    beforeEach(() => {
      pred = async num => num > 5;
      iterable = R.range(0, 10);
    });
    
    it('should filter by predicate', async () => {
      await expect(filterSeries(pred, iterable))
        .to.eventually.eql([6, 7, 8, 9]);
    });
    
    it('should run in series', async () => {
      await assertIsParallel(false, filterSeries);
    });
    
    it('should propagate errors', async () => {
      const error = Error('woops');
      pred = () => {
        throw error;
      };
      await expect(filterSeries(pred, iterable))
        .to.eventually.be.rejectedWith(error);
    });
    
    it('should be curried', async () => {
      await expect(filterSeries(pred)(iterable))
        .to.eventually.eql([6, 7, 8, 9]);
    });
    
  });
  
  describe('flatMap', () => {
    
    let pred;
    beforeEach('stub', () => {
      pred = sinon.spy((num) => [num, num + 1]);
    });
    
    it('should call predicate once for each item in iterable', async () => {
      await flatMap(pred, [1, 2, 3, 4, 5]);
      expect(pred.callCount).to.eql(5);
    });
    
    it('should call predicate with iterable element', async () => {
      const iterable = [{}, {}, {}];
      await flatMap(pred, iterable);
      pred.args.forEach(([arg], i) => {
        expect(arg).to.eql(iterable[i]);
      });
    });
    
    it('should return concatenated results', async () => {
      const result = await flatMap(pred, [1, 2, 3]);
      expect(result).to.eql([1, 2, 2, 3, 3, 4]);
    });
    
    it('should run in parallel', async () => {
      await assertIsParallel(true, flatMap);
    });
    
    it('should be curried', async () => {
      const result = await flatMap(pred)([1]);
      expect(result).to.eql([1, 2]);
    });

  });
  
  describe('flatMapSeries', () => {
    
    let pred;
    beforeEach('stub', () => {
      pred = sinon.spy((num) => [num, num + 1]);
    });
    
    it('should call predicate once for each item in iterable', async () => {
      await flatMapSeries(pred, [1, 2, 3, 4, 5]);
      expect(pred.callCount).to.eql(5);
    });
    
    it('should call predicate with iterable element', async () => {
      const iterable = [{}, {}, {}];
      await flatMapSeries(pred, iterable);
      pred.args.forEach(([arg], i) => {
        expect(arg).to.eql(iterable[i]);
      });
    });
    
    it('should return concatenated results', async () => {
      const result = await flatMapSeries(pred, [1, 2, 3]);
      expect(result).to.eql([1, 2, 2, 3, 3, 4]);
    });
    
    it('should run in series', async () => {
      await assertIsParallel(false, flatMapSeries);
    });
    
    it('should be curried', async () => {
      const result = await flatMapSeries(pred)([1]);
      expect(result).to.eql([1, 2]);
    });

  });
  
  
  describe('forEach', () => {
    
    it('should call the predicate once per item', async () => {
      const pred = sinon.stub();
      await forEach(pred, [1, 2, 3, 4, 5]);
      expect(pred.callCount).to.eql(5);
    });
    
    it('should call predicate with item', async () => {
      const pred = sinon.stub();
      const arr = ['some-item-a', 'some-item-b'];
      await forEach(pred, arr);
      expect(pred.args.map(R.head)).to.eql(arr);
    });
    
    it('should return the iterable', async () => {
      const iterable = [1, 2, 3, 4, 5];
      const result = await forEach((el) => el, iterable);
      expect(result).to.equal(iterable);
    });
    
    it('should run in parallel', async () => {
      await assertIsParallel(true, forEach);
    });
    
    it('should be curried', async () => {
      const stub = sinon.stub();
      await forEach(stub)([1, 2, 3, 4, 5]);
      expect(stub.callCount).to.eql(5);
    });
    
  });
  
  describe('forEachSeries', () => {
    
    it('should call the predicate once per item', async () => {
      const pred = sinon.stub();
      const iterable = [1, 2, 3, 4];
      await forEachSeries(pred, iterable);
      expect(pred.args).to.eql([
        [1], [2], [3], [4],
      ]);
    });
    
    it('should call predicate with item', async () => {
      const pred = sinon.stub();
      const arr = ['some-item-a', 'some-item-b'];
      await forEachSeries(pred, arr);
      expect(pred.args.map(R.head)).to.eql(arr);
    });
    
    
    it('should return the iterable', async () => {
      const iterable = [1, 2, 3, 4];
      await expect(forEachSeries(() => {}, iterable))
        .to.eventually.equal(iterable);
    });
    
    it('should run in series', async () => {
      await assertIsParallel(false, forEachSeries);
    });
    
    it('should be curried', async () => {
      const stub = sinon.stub();
      await forEachSeries(stub)([1, 2, 3, 4, 5]);
      expect(stub.callCount).to.eql(5);
    });
    
  });
  
  describe('fromCallback', () => {
    
    it('should create a promise resolved by the passed callback', async () => {
      const res = await fromCallback((cb) => {
        return cb(null, [1, 2, 3]);
      });
      expect(res).to.eql([1, 2, 3]);
    });
    
    it('should create a promise rejected by the passed callback', async () => {
      const error = Error('oops');
      await expect(fromCallback((cb) => cb(error))).to.be.rejectedWith(error);
    });
    
  });
  
  describe('map', () => {
    
    let pred, iterable, result;
    beforeEach(() => {
      pred = async num => num + 10;
      iterable = R.range(0, 5);
      result = [10, 11, 12, 13, 14];
    });
    
    it('should map with async predicate', async () => {
      await expect(map(pred, iterable))
        .to.eventually.eql(result);
    });
    
    it('should run in series', async () => {
      await assertIsParallel(true, map);
    });
    
    it('should propagate errors', async () => {
      const error = Error('oops');
      pred = () => {
        throw error;
      };
      await expect(map(pred, iterable))
        .to.be.rejectedWith(error);
    });
    
    it('should be curried', async () => {
      await expect(map(pred)(iterable))
        .to.eventually.eql(result);
    });
    
  });
  
  describe('mapSeries', () => {
    
    let pred, iterable, result;
    beforeEach(() => {
      pred = async num => num + 10;
      iterable = R.range(0, 5);
      result = [10, 11, 12, 13, 14];
    });
    
    it('should map with async predicate', async () => {
      await expect(mapSeries(pred, iterable))
        .to.eventually.eql(result);
    });
    
    it('should run in series', async () => {
      await assertIsParallel(false, mapSeries);
    });
    
    it('should propagate errors', async () => {
      const error = Error('oops');
      pred = () => {
        throw error;
      };
      await expect(mapSeries(pred, iterable))
        .to.be.rejectedWith(error);
    });
    
    it('should be curried', async () => {
      await expect(mapSeries(pred)(iterable))
        .to.eventually.eql(result);
    });
    
  });
  
  describe('pipe', () => {
    
    let funcs;
    beforeEach('setup', () => {
      funcs = [
        async ({ id }) => id,
        async num => num + 100,
        async num => +[...`${ num }`].reverse().join(''),
      ];
    });
    
    it('should perform left-to-right function composition of async functions', async () => {
      const composed = pipe(...funcs);
      const input = { id: 123 };
      await expect(composed(input)).to.eventually.eql(322);
    });
    
  });
  
  describe('promisify', () => {
    
    it('should return a function', () => {
      expect(promisify(() => {})).to.be.a('function');
    });
    
    it('should return a promise from the wrapped function', () => {
      const promise = promisify(() => {})();
      expect(isPromise(promise)).to.eql(true);
    });
    
    it('should resolve with the callback results', async () => {
      const result = await promisify((one, two, three, done) => {
        return done(null, R.sum([one, two, three]));
      })(1, 2, 3);
      expect(result).to.eql(6);
    });
    
    it('should reject with the callback error', async () => {
      const error =  Error('oops');
      await expect(promisify((one, done) => done(error))(1))
        .to.be.rejectedWith(error);
    });
    
  });
  
  describe('props', () => {
    
    it('should resolve object values', async () => {
      const input = {
        one: Promise.resolve(1),
        two: Promise.resolve(2),
        three: Promise.resolve(3),
      };
      const output = await props(input);
      expect(output).to.eql({
        one: 1,
        two: 2,
        three: 3,
      });
    });
    
    it('should reject if any promise rejects', async () => {
      const err = Error('oops');
      const input = {
        one: Promise.resolve(1),
        two: Promise.reject(err),
        three: Promise.resolve(3),
      };
      await expect(props(input)).to.be.rejectedWith(err);
    });
        
    it('should work with arrays', async () => {
      const out = await props(['a', 'b', 'c']);
      expect(out).to.eql({
        0: 'a',
        1: 'b',
        2: 'c',
      });
    });
    
  });
  
  describe('race', () => {
    
    it('should resolve the value of the first-resolved promise', async () => {
      
      await expect(race([
        delay(50).then(() => 'second'),
        delay(10).then(() => 'first'),
        delay(200).then(() => 'third'),
      ])).to.eventually.eql('first');
      
    });
    
    it('should reject if any promise rejects first', async () => {
      const error = Error('woops');
      await expect(race([
        delay(50).then(() => 'second'),
        delay(10).then(() => {
          throw error;
        }),
        delay(100).then(() => 'third'),
      ])).to.be.rejectedWith(error);
      
    });
    
  });
  
  describe('reduce', () => {
    
    let pred, iterable, init;
    beforeEach('stub', () => {
      pred = sinon.spy((sum, num) => (sum + num));
      iterable = [1, 2, 3, 4, 5];
      init = 10;
    });
    
    let result;
    beforeEach('call', async () => {
      result = await reduce(pred, init, iterable);
    });
    
    it('should call predicate once for each item in iterable', async () => {
      expect(pred.callCount).to.eql(5);
    });
    
    it('should call predicate with accumulator and element', async () => {
      expect(pred.args.map(R.head)).to.eql([10, 11, 13, 16, 20]);
      expect(pred.args.map(R.nth(1))).to.eql(iterable);
    });
    
    it('should return the final accumulator value', async () => {
      expect(result).to.eql(25);
    });
    
    it('should work with any iterable', async () => {
      const obj = {
        * [Symbol.iterator]() {
          yield 2;
          yield 4;
          yield 6;
        },
      };
      const result = await reduce(pred, init, obj);
      expect(result).to.eql(22);
    });
    
    it('should be curried', async () => {
      const result = await reduce(pred)(init)(iterable);
      expect(result).to.eql(25);
    });
    
  });
    
  describe('timeout', () => {
    
    it('should resolve if promise is resolved before timeout', async () => {
      const promise = delay(100).then(() => 'done');
      await expect(timeout(500, promise)).to.eventually.eql('done');
    });
    
    it('should be rejected with a TimeoutError if promise does not resolve before timeout', async () => {
      const promise = delay(500);
      await expect(timeout(100, promise))
        .to.be.rejectedWith(TimeoutError, 'timed out after 100ms');
    });
    
    it('should propagate promise errors', async () => {
      const error = Error('woops');
      const promise = delay(100).then(() => {
        throw error;
      });
      await expect(timeout(100, promise))
        .to.be.rejectedWith(error);
    });
    
  });
  
  describe('toAsync', () => {
    
    it('should return a function', () => {
      expect(toAsync(() => {})).to.be.a('function');
    });
    
    it('wrapped function should return a promise for the wrapped result', async () => {
      const output = {};
      const promise = toAsync(() => output)();
      expect(isPromise(promise)).to.eql(true);
      expect(await promise).to.equal(output);
    });
    
    it('wrapped function should return a promise for the wrapped error', async () => {
      const error = Error('oops');
      const promise = toAsync(() => {
        throw error;
      })();
      expect(isPromise(promise)).to.eql(true);
      await expect(promise).to.be.rejectedWith(error);
    });
    
  });
    
});
