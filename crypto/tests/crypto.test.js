'use strict';

// modules
const { expect } = require('chai');

// local
const {
  md5,
  hashWith,
  sha256,
  sha512,
} = require('..');

const ALGOS = {
  password: {
    md5: '5f4dcc3b5aa765d61d8327deb882cf99',
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    // eslint-disable-next-line max-len
    sha512: 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
  },
};

describe('crypto lib', () => {
  
  describe('hashWith', () => {
    
    Object.entries(ALGOS).forEach(([input, hashes]) => {
      Object.entries(hashes).forEach(([algo, hash]) => {
        
        it('should generate hashes by type', () => {
          expect(hashWith(algo, input)).to.eql(hash);
        });
        
      });
    });
    
    it('should be curried', () => {
      expect(hashWith('md5')('password')).to.eql(ALGOS.password.md5);
    });
    
  });
  
  describe('md5', () => {
    
    it('should generate md5 hashes', () => {
      Object.entries(ALGOS).forEach(([input, hashes]) => {
        expect(md5(input)).to.eql(hashes.md5);
      });
    });
    
  });
  
  describe('sha256', () => {
    
    it('should generate sha256 hashes', () => {
      Object.entries(ALGOS).forEach(([input, hashes]) => {
        expect(sha256(input)).to.eql(hashes.sha256);
      });
    });
    
  });
  
  describe('sha512', () => {
    
    it('should generate sha512 hashes', () => {
      Object.entries(ALGOS).forEach(([input, hashes]) => {
        expect(sha512(input)).to.eql(hashes.sha512);
      });
    });
    
  });
    
});
