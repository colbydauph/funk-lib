'use strict';

// modules
const { expect } = require('chai');

// local
const { now } = require('..');

describe('datetime lib', () => {
  
  describe('now', () => {
    
    it('should return the current epoch in ms', () => {
      const delta = now() - Date.now();
      expect(delta).to.be.lessThan(5);
    });
    
  });
    
});
