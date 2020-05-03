// modules
import * as R from 'ramda';
import sinon from 'sinon';
import { expect } from 'chai';

import { delay } from 'funk-lib/async';

// local
import {
  noop,
  on,
  once,
  pipeC,
  debounce,
  throttle,
  Y,
} from '..';

describe('function lib', () => {
  
  describe('noop', () => {
    
    it('should return undefined', () => {
      expect(noop()).to.eql(undefined);
    });
    
  });
  
  describe('on', () => {
    
    it('should apply unary func to each argument and pass results to binary func', () => {
      const binary = R.add;
      const unary = R.prop('total');
      const left = { total: 100 };
      const right = { total: 75 };
      expect(on(binary, unary, left, right)).to.eql(175);
    });
    
    it('should be curried', () => {
      const binary = R.add;
      const unary = R.prop('total');
      const left = { total: 100 };
      const right = { total: 75 };
      expect(on(binary)(unary)(left)(right)).to.eql(175);
    });
    
  });
  
  describe('once', () => {
    
    it('should only call func on first call', () => {
      const func = sinon.stub().callsFake((one, two) => one + two + 3);
      const onced = once(func);
      
      expect(onced(1, 2)).to.eql(6);
      
      [...Array(10)].forEach(_ => {
        // returns cached value
        expect(onced(1, 2)).to.eql(6);
        expect(func.callCount).to.eql(1);
      });
      
    });
    
  });

  describe('pipeC', () => {
    
    it('should be a curried pipe', () => {
      const f = pipeC(
        (one, two, three) => (one + two + three),
        n => n * 2,
        n => n - 1,
      );
      
      expect(f(1, 2, 3)).to.eql(11);
      expect(f(1)(2)(3)).to.eql(11);
    });
    
  });

  describe('Y', () => {
    
    it('should define recursion', () => {
      
      const fib = Y(f => n => {
        return (n <= 2) ? 1 : f(n - 1) + f(n - 2);
      });
      
      expect(fib(7)).to.eql(13);

    });
    
  });
  
  describe('throttle', () => {
    
    it('should call a function at most every n ms', async () => {
      
      const stub = sinon.stub().callsFake(n => n + 1);
      
      const throttled = throttle(10, stub);
      
      throttled(1);
      throttled(2);
      await delay(15);
      
      throttled(3);
      await delay(15);
      
      throttled(4);
      await delay(1);
      throttled(5);
      
      expect(stub.callCount).to.eql(3);
      expect(stub.args.map(R.head)).to.eql([1, 3, 4]);
      
    });
    
  });
  
  describe('debounce', () => {
    
    it('should call function after not being called for n ms', async () => {
      
      const stub = sinon.stub().callsFake(n => n + 1);
      const debounced = debounce(10, stub);
       
      debounced(1);
      await delay(5);
      debounced(3);
      await delay(5);
      debounced(3);
      await delay(5);
      debounced(4);
      await delay(5);
      debounced(5);
      
      expect(stub.callCount).to.eql(0);
      await delay(15);
      expect(stub.callCount).to.eql(1);
      
    });
    
  });
  
});
