'use strict';

// modules
const { expect } = require('chai');

// local
const { md5, sha256, sha512 } = require('..');

describe('crypto lib', () => {
  
  describe('md5', () => {
    
    it('should generate md5 hashes', () => {
      expect(md5('password')).to.eql('5f4dcc3b5aa765d61d8327deb882cf99');
    });
    
  });
  
  describe('sha256', () => {
  
    it('should generate sha256 hashes', () => {
      expect(sha256('password')).to.eql('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
    });
  
  });
  
  describe('sha512', () => {
  
    it('should generate sha512 hashes', () => {
      // eslint-disable-next-line max-len
      expect(sha512('password')).to.eql('b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86');
    });
  
  });
    
});
