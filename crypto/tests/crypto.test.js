'use strict';

// modules
const { expect } = require('chai');

// local
const { md5 } = require('..');

describe('crypto lib', () => {
  
  describe('md5', () => {
    
    it('should generate md5 hashes', () => {
      expect(md5('password')).to.eql('5f4dcc3b5aa765d61d8327deb882cf99');
    });
    
  });
    
});
