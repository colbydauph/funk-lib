'use strict';

// modules
const { expect } = require('chai');

// local
const { pickAs } = require('..');

describe('object lib', () => {

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
