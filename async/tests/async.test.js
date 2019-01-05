'use strict';

// modules
const { expect } = require('chai');
const sinon = require('sinon');
const R = require('ramda');

// local
const { isPromise } = require('../../is');
const { random } = require('../../number');
const { from } = require('../../iterable/sync');

// local
const {
  callbackify,
  deferred,
  delay,
  every,
  everySeries,
  filter,
  filterSeries,
  find,
  findSeries,
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

// it('should work with sync functions');

describe('async lib', () => {
  
  describe('callbackify', () => {
    
    it('should return a function', () => {
      expect(callbackify(() => {})).to.be.a('function');
    });
    
    it('should call the wrapped function with the input args', (cb) => {
      const args = [1, 2, 3];
      const pred = sinon.stub().resolves();
      callbackify(pred)(...args, (err, res) => {
        expect(pred.args[0]).to.eql(args);
        cb(err);
      });
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
        callbackify(async () => {
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
      await delay(50);
      const end = Date.now();
      expect(end - start).to.be.closeTo(50, 10);
    });
    
  });
  
  describe('deferred', () => {
    
    let promise, resolve, reject;
    beforeEach('', () => {
      ({ promise, resolve, reject } = deferred());
    });
    
    it('should create an externally resolvable promise', async () => {
      const res = { obj: true };
      resolve(res);
      const out = await promise;
      expect(out).to.equal(res);
    });
    
    it('should create an externally rejectable promise', async () => {
      const err = Error('oops');
      reject(err);
      await expect(promise).to.be.rejectedWith(err);
    });
    
  });
  
  describe('every', () => {
    
    let pred, iterable, output;
    beforeEach('stub', () => {
      pred = sinon.spy(async num => num < 20);
      iterable = R.range(0, 10);
      output = true;
    });
    
    it('should return true if all items pass predicate', async () => {
      await expect(every(pred, iterable))
        .to.eventually.eql(output);
    });
    
    it('should return false if any item does not pass predicate', async () => {
      iterable.push(50);
      await expect(every(pred, iterable))
        .to.eventually.eql(false);
    });
    
    xit('should run in parallel', async () => {
      await assertIsParallel(true, every);
    });
    
    // short circuit iteration
    xit('should eagerly resolve false');
    
    it('should be curried', async () => {
      await expect(every(pred)(iterable))
        .to.eventually.eql(output);
    });
    
  });
  
  describe('everySeries', () => {
    
    let pred, iterable, output;
    beforeEach('stub', () => {
      pred = async num => num < 20;
      iterable = R.range(0, 10);
      output = true;
    });
    
    it('should return true if all items pass predicate', async () => {
      await expect(everySeries(pred, iterable))
        .to.eventually.eql(output);
    });
    
    it('should return false if any item does not pass predicate', async () => {
      iterable.push(50);
      await expect(everySeries(pred, iterable))
        .to.eventually.eql(false);
    });
    
    xit('should run in series', async () => {
      // await assertIsParallel(false, everySeries);
    });
    
    it('should be curried', async () => {
      await expect(everySeries(pred)(iterable))
        .to.eventually.eql(output);
    });
    
  });
  
  describe('filter', () => {
    
    let pred, iterable, result;
    beforeEach('stub', () => {
      pred = async num => num > 5;
      iterable = R.range(0, 10);
      result = [6, 7, 8, 9];
    });
    
    it('should filter by predicate', async () => {
      await expect(filter(pred, iterable))
        .to.eventually.eql(result);
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
        .to.eventually.eql(result);
    });
    
    // fixme
    xit('should work with iterables', async () => {
      iterable = from(iterable);
      await expect(filter(pred, iterable))
        .to.eventually.eql([]);
    });
    
    it('should work with async iterables');
    
  });
  
  describe('filterSeries', () => {
    
    let pred, iterable;
    beforeEach('stub', () => {
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
    
    it('should work with iterables');
    
    it('should work with async iterables');
    
  });
  
  describe('flatMap', () => {
    
    let pred, iterable, output;
    beforeEach('stub', () => {
      iterable = [1, 2, 3, 4, 5];
      pred = sinon.spy(async (num) => [num, `${ num }a`]);
      output = [1, '1a', 2, '2a', 3, '3a', 4, '4a', 5, '5a'];
    });
    
    it('should call predicate once for each item in iterable', async () => {
      await flatMap(pred, iterable);
      expect(pred.callCount).to.eql(5);
    });
    
    it('should call predicate with iterable element', async () => {
      await flatMap(pred, iterable);
      expect(pred.args.map(R.head)).to.eql(iterable);
    });
    
    it('should return concatenated results', async () => {
      await expect(flatMap(pred, iterable))
        .to.eventually.eql(output);
    });
    
    it('should run in parallel', async () => {
      await assertIsParallel(true, flatMap);
    });
    
    it('should be curried', async () => {
      await expect(flatMap(pred)(iterable))
        .to.eventually.eql(output);
    });

    it('should work with iterables', async () => {
      await flatMap(pred, from(iterable));
      expect(pred.callCount).to.eql(5);
    });

    it('should work with async iterables');

  });
  
  describe('flatMapSeries', () => {
    
    let pred, iterable, output;
    beforeEach('stub', () => {
      iterable = [1, 2, 3, 4, 5];
      pred = sinon.spy((num) => [num, `${ num }a`]);
      output = [1, '1a', 2, '2a', 3, '3a', 4, '4a', 5, '5a'];
    });
    
    it('should call predicate once for each item in iterable', async () => {
      await flatMapSeries(pred, iterable);
      expect(pred.callCount).to.eql(5);
    });
    
    it('should call predicate with iterable element', async () => {
      await flatMapSeries(pred, iterable);
      expect(pred.args.map(R.head)).to.eql(iterable);
    });
    
    it('should return concatenated results', async () => {
      expect(flatMapSeries(pred, iterable))
        .to.eventually.eql(output);
    });
    
    it('should run in series', async () => {
      await assertIsParallel(false, flatMapSeries);
    });
    
    it('should be curried', async () => {
      expect(flatMapSeries(pred)(iterable))
        .to.eventually.eql(output);
    });

    it('should work with iterables', async () => {
      await flatMapSeries(pred, from(iterable));
      expect(pred.callCount).to.eql(5);
    });

    it('should work with async iterables');

  });
  
  describe('find', () => {
    
    let pred, iterable, result;
    before('stub', () => {
      pred = async num => num > 5;
      iterable = R.range(0, 10);
      result = 6;
    });
    
    it('should return the first item with a truthy predicate', async () => {
      await expect(find(pred, iterable))
        .to.eventually.eql(result);
    });
    
    it('should should be curried', async () => {
      await expect(find(pred)(iterable))
        .to.eventually.eql(result);
    });
    
    it('should run in parallel', async () => {
      await assertIsParallel(true, find);
    });
    
    it('should should work with iterables', async () => {
      await expect(find(pred, from(iterable)))
        .to.eventually.eql(result);
    });
    
    it('should work with async iterables');
    
    // short circuit iteration
    xit('should eagerly resolve found value');
    
    it('should return undefined if no item found', async () => {
      pred = num => num > 1000;
      await expect(find(pred, iterable))
        .to.eventually.eql(undefined);
    });
    
  });
  
  describe('findSeries', () => {
    
    let pred, iterable, result;
    before('stub', () => {
      pred = async num => num > 5;
      iterable = R.range(0, 10);
      result = 6;
    });
    
    it('should return the first item with a truthy predicate', async () => {
      await expect(findSeries(pred, iterable))
        .to.eventually.eql(result);
    });
    
    it('should should be curried', async () => {
      await expect(findSeries(pred)(iterable))
        .to.eventually.eql(result);
    });
    
    it('should run in series', async () => {
      await assertIsParallel(false, findSeries);
    });
    
    it('should should work with iterables', async () => {
      await expect(findSeries(pred, from(iterable)))
        .to.eventually.eql(result);
    });
    
    it('should work with async iterables');
    
    it('should return undefined if no item found', async () => {
      pred = num => num > 1000;
      await expect(findSeries(pred, iterable))
        .to.eventually.eql(undefined);
    });
    
  });
  
  describe('forEach', () => {
    
    let pred, iterable;
    beforeEach('stub', () => {
      pred = sinon.stub();
      iterable = [1, 2, 3, 4, 5];
    });
    
    it('should call the predicate once per item', async () => {
      await forEach(pred, iterable);
      expect(pred.callCount).to.eql(iterable.length);
    });
    
    it('should call predicate with item', async () => {
      await forEach(pred, iterable);
      expect(pred.args.map(R.head)).to.eql(iterable);
    });
    
    it('should return the iterable', async () => {
      await expect(forEach((el) => el, iterable))
        .to.eventually.equal(iterable);
    });
    
    it('should run in parallel', async () => {
      await assertIsParallel(true, forEach);
    });
    
    it('should be curried', async () => {
      await forEach(pred)([1, 2, 3, 4, 5]);
      expect(pred.callCount).to.eql(5);
    });
    
    it('should work with iterables', async () => {
      await forEach(pred, from(iterable));
      expect(pred.args.map(R.head)).to.eql(iterable);
    });
    
    it('should work with async iterables');
    
  });
  
  describe('forEachSeries', () => {
    
    let pred, iterable;
    beforeEach('stub', () => {
      pred = sinon.stub();
      iterable = [1, 2, 3, 4];
    });
    
    it('should call the predicate once per item', async () => {
      await forEachSeries(pred, iterable);
      expect(pred.callCount).to.eql(iterable.length);
    });
    
    it('should call predicate with item', async () => {
      await forEachSeries(pred, iterable);
      expect(pred.args.map(R.head)).to.eql(iterable);
    });
    
    it('should return the iterable', async () => {
      await expect(forEachSeries(() => {}, iterable))
        .to.eventually.equal(iterable);
    });
    
    it('should run in series', async () => {
      await assertIsParallel(false, forEachSeries);
    });
    
    it('should be curried', async () => {
      await forEachSeries(pred)([1, 2, 3, 4, 5]);
      expect(pred.callCount).to.eql(5);
    });
    
    it('should work with iterables', async () => {
      await forEachSeries(pred, from(iterable));
      expect(pred.args.map(R.head)).to.eql(iterable);
    });
    
    it('should work with async iterables');
    
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
    
    it('should work with iterables', async () => {
      await expect(map(pred, from(iterable)))
        .to.eventually.eql(result);
    });
    
    xit('should work with async iterables?');
    
    it('should work on functions?');
    
    it('should work on objects', async () => {
      const obj = {
        a: 1,
        b: 2,
      };
      const expected = {
        a: 11,
        b: 12,
      };
      await expect(map(pred, obj))
        .to.eventually.eql(expected);
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
    
    it('should work with iterables', async () => {
      await expect(mapSeries(pred, from(iterable)))
        .to.eventually.eql(result);
    });
    
    it('should work with async iterables');
    
    it('should work on objects', async () => {
      const obj = {
        a: 1,
        b: 2,
      };
      const expected = {
        a: 11,
        b: 12,
      };
      await expect(mapSeries(pred, obj))
        .to.eventually.eql(expected);
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
      await expect(props(input)).to.eventually.eql({
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
    
    it('should work with iterables?');
    
    it('should work with async iterables?');
    
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
    
    // spec says never resolve. logic says immediate resolve
    it('should ? if passed an empty array');
    
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
    
    it('should work with iterables', async () => {
      await expect(reduce(pred, init, from(iterable)))
        .to.eventually.eql(25);
    });
    
    it('should work with async iterables');
    
    it('should be curried', async () => {
      const result = await reduce(pred)(init)(iterable);
      expect(result).to.eql(25);
    });
    
  });
    
  describe('timeout', () => {
    
    it('should resolve if promise is resolved before timeout', async () => {
      const promise = delay(10).then(() => 'done');
      await expect(timeout(500, promise)).to.eventually.eql('done');
    });
    
    it('should be rejected with a TimeoutError if promise does not resolve before timeout', async () => {
      const promise = delay(500);
      await expect(timeout(10, promise))
        .to.be.rejectedWith(TimeoutError, 'timed out after 10ms');
    });
    
    it('should propagate promise errors', async () => {
      const error = Error('woops');
      const promise = delay(10).then(() => {
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
