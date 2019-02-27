'use strict';

// modules
const { expect } = require('chai');

// local
const {
  parseContentType,
} = require('..');

describe('http functions', () => {
  
  describe('parseContentType', () => {
    
    it('should parse all directives', () => {
      const parts = parseContentType('multipart/form-data; boundary=something; charset=utf-8');
      expect(parts).to.eql({
        mimeType: 'multipart/form-data',
        boundary: 'something',
        charset: 'utf-8',
      });
    });
    
    it('should not parse missing directives', () => {
      const parts = parseContentType('application/javascript');
      expect(parts).to.eql({
        mimeType: 'application/javascript',
      });
    });
    
    it('should parse empty values', () => {
      expect(parseContentType('')).to.eql({});
      expect(parseContentType(undefined)).to.eql({});
    });
    
  });
  
});
