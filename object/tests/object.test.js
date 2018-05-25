'use strict';

// modules
const { expect } = require('chai');

// local
const {
  deepFreeze,
  firstKey,
  firstPair,
  firstValue,
  mapKeys,
  mapPairs,
  mapValues,
  pickAs,
} = require('..');

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
  
  describe('mapKeys', () => {
    
    it('should update keys by predicate', () => {
      const input = {
        one: 1,
        two: 2,
        three: 3,
      };
      const pred = (key) => [...key].reverse().join('');
      const expected = {
        eno: 1,
        owt: 2,
        eerht: 3,
      };
      expect(mapKeys(pred, input)).to.eql(expected);
    });
    
  });
  
  describe('mapValues', () => {
    
    it('should update values by predicate', () => {
      const input = {
        1: 'one',
        2: 'two',
        3: 'three',
      };
      const pred = (val) => [...val].reverse().join('');
      const expected = {
        1: 'eno',
        2: 'owt',
        3: 'eerht',
      };
      expect(mapValues(pred, input)).to.eql(expected);
    });
    
  });

  describe('mapPairs', () => {
    
    it('should transform pairs by predicate', () => {
      const input = {
        one: 1,
        two: 2,
        three: 3,
      };
      const pred = ([key, val]) => [
        [...key].reverse().join(''),
        val * 3,
      ];
      const expected = {
        eno: 3,
        owt: 6,
        eerht: 9,
      };
      expect(mapPairs(pred, input)).to.eql(expected);
    });
    
  });

  describe('firstKey', () => {
    
    it('should return the first object key', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(firstKey(obj)).to.eql('a');
    });
    
    it('should return the first array key', () => {
      const arr = [5, 6, 7];
      expect(firstKey(arr)).to.eql('0');
    });
    
  });
  
  describe('firstValue', () => {
    
    it('should return the first object value', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(firstValue(obj)).to.eql(1);
    });
    
    it('should return the first array value', () => {
      const arr = [5, 6, 7];
      expect(firstValue(arr)).to.eql(5);
    });
    
  });
  
  describe('firstPair', () => {
    
    it('should return the first object pair', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(firstPair(obj)).to.eql(['a', 1]);
    });
    
    it('should return the first array pair', () => {
      const arr = [5, 6, 7];
      expect(firstPair(arr)).to.eql(['0', 5]);
    });
    
  });

});
