'use strict';

// modules
const { expect } = require('chai');

// local
const {
  isDataUrl,
  parseDataUrl,
} = require('..');

describe('url lib', () => {

  describe('isDataUrl', () => {

    it('should be true for data urls', () => {
      expect(isDataUrl('data:,Hello!')).to.eql(true);
      expect(isDataUrl('data:application/json;base64,dGhpcyBpcyB0ZXN0IHRleHQ=')).to.eql(true);
    });

    it('should be false anything else', () => {
      expect(isDataUrl('http://foo.bar')).to.eql(false);
      expect(isDataUrl('not a url')).to.eql(false);
    });

  });

  describe('parseDataUrl', () => {

    it('should parse simple data url', () => {
      expect(parseDataUrl('data:,Hello!')).to.eql({
        base64: false,
        data: 'Hello!',
        mediatype: 'text/plain;charset=US-ASCII',
      });
    });
    
    it('should parse a base64 data url', () => {
      expect(parseDataUrl('data:application/json;base64,eyJ0ZXN0IjoidGV4dCJ9')).to.eql({
        base64: true,
        data: 'eyJ0ZXN0IjoidGV4dCJ9',
        mediatype: 'application/json',
      });
    });

  });

});
