'use strict';

// modules
const sinon = require('sinon');
const { expect } = require('chai');

// local
const {
  // yieldWith,
  yieldWithAsync,
} = require('..');

describe('yield-With', () => {
      
  describe('yieldWith', () => {
    
  });
  
  describe('yieldWithAsync', () => {
    
    let onYield, generator;
    beforeEach('stub', () => {
      onYield = sinon.stub();
      generator = (async function* generator() {})();
    });
    
    it('should return the generator return', async () => {
      const out = { id: 1 };
      generator = (async function* generator() {
        yield 1;
        return out;
      })();
      await expect(yieldWithAsync(onYield, generator)).to.eventually.equal(out);
    });
    
    it('should not delegate to yielded generators', async () => {
      const gen = (async function* gen() {
        yield 1;
        yield 2;
      })();
      generator = (async function* generator() {
        yield gen;
      })();
      await yieldWithAsync(onYield, generator);
      expect(onYield.callCount).to.eql(1);
      expect(onYield.args[0][0]).to.equal(gen);
    });
    
    it('should not delegate to generators returned from onYield', async () => {
      let gen;
      onYield = () => {
        gen = (async function* gen() {})();
        return gen;
      };
      let out;
      generator = (async function* gen() {
        out = yield 1;
      })();
      await yieldWithAsync(onYield, generator);
      expect(gen).to.equal(out);
    });
    
    describe('onYield', () => {
      
      it('should be called with the yielded value', async () => {
        const item = { id: 1 };
        generator = (async function* generator() {
          yield item;
        })();
        await yieldWithAsync(onYield, generator);
        expect(onYield.args[0].length).to.eql(1);
        expect(onYield.args[0][0]).to.equal(item);
      });
      
      it('should be called once for each yield', async () => {
        const items = [
          1, 2, 3, false, {}, [], 'test',
          () => {}, async () => {}, (function* gen() {
            for (const el of [1, 2, 3]) yield el;
          })(),
        ];
        generator = (async function* generator() {
          for (const item of items) yield item;
          return false;
        })();
        await yieldWithAsync(onYield, generator);
        expect(onYield.callCount).to.eql(10);
      });
      
      it('should determine the yield return value', async () => {
        const item = { id: 999 };
        onYield = () => item;
        let out;
        generator = (async function* generator() {
          out = yield 0;
        })();
        await yieldWithAsync(onYield, generator);
        await expect(out).to.equal(item);
      });
            
      it('should throw onYield errors back into the generator', async () => {
        const error = Error('oops');
        onYield = num => {
          throw error;
        };
        generator = (async function* generator() {
          yield 1;
          return 2;
        })();
        await expect(yieldWithAsync(onYield, generator))
          .to.eventually.be.rejectedWith(error);
      });
      
    });
    
    it('should work with synchronous iterators', async () => {
      const arr = [1, 2, 3];
      generator = arr[Symbol.iterator]();
      await yieldWithAsync(onYield, generator);
      const yields = onYield.args.map(([arg]) => arg);
      expect(yields).to.eql(arr);
    });
    
    
    it('should be continuable from a thrown error', async () => {
      const error = Error('oops');
      onYield = num => {
        if (num < 10) return num;
        throw error;
      };
      generator = (async function* generator() {
        try {
          yield 20;
        } catch (err) {
          yield 1;
        }
        return 10;
      })();
      await expect(yieldWithAsync(onYield, generator))
        .to.eventually.equal(10);
    });
    
    it('should be returnable from a thrown error', async () => {
      const error = Error('oops');
      onYield = num => {
        if (num < 10) return num;
        throw error;
      };
      generator = (async function* generator() {
        try {
          yield 20;
        } catch (err) {
          return err;
        }
        return 10;
      })();
      await expect(yieldWithAsync(onYield, generator))
        .to.eventually.equal(error);
    });
        
  });
  
});
