'use strict';

// modules
const { expect } = require('chai');

// local
const { deepFreeze, pickAs } = require('..');

describe('object lib', () => {
  
  describe('deepFreeze', () => {
    
    let obj;
    beforeEach(() => {
      obj = {
        a: 1,
        b: true,
        c: [2, { d: 3 }],
        d: {
          e: undefined,
          f: Symbol('g'),
        },
      };
    });
    
    it('should deeply freeze', () => {
      deepFreeze(obj);
      
      expect(() => {
        obj.a = 2;
      }).to.throw(Error);
      
      expect(() => {
        obj.c[0] = 3;
      }).to.throw(Error);
      
      expect(() => {
        obj.c[1].e = 4;
      }).to.throw(Error);
      
      expect(() => {
        obj.d.e = 5;
      }).to.throw(Error);
      
    });
    
  });

  describe('pickAs', () => {
    
    let obj;
    beforeEach(() => {
      obj = { a: 1, b: 2, c: 3, d: 4 };
    });
    
    it('should rename keys', () => {
      const result = pickAs({ a: 'b', c: 'd' })(obj);
      expect(result.b).to.eql(1);
      expect(result.d).to.eql(3);
    });
    
    it('should discard keys not in picker', () => {
      const result = pickAs({ a: 'b', c: 'd' })(obj);
      expect(result).to.not.have.ownProperty('a');
      expect(result).to.not.have.ownProperty('c');
    });
    
  });
  

});
