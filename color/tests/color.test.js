'use strict';

// modules
const { expect } = require('chai');

// local
const { hexToRgb, rgbToHex } = require('..');

describe('color lib', () => {
  
  describe('hexToRgb()', () => {
    
    it('should convert hex to rgb', () => {
      const hex = '#0033ff';
      const rgb = { r: 0, g: 51, b: 255 };
      expect(hexToRgb(hex)).to.eql(rgb);
    });
    
    it('should work for shorthand hex values', () => {
      const hex = '#02a';
      const rgb = { r: 0, g: 34, b: 170 };
      expect(hexToRgb(hex)).to.eql(rgb);
    });
    
  });
  
  describe('rgbToHex()', () => {
    
    it('should convert rgb to hex', () => {
      const rgb = { r: 0, g: 51, b: 255 };
      const hex = '#0033ff';
      expect(rgbToHex(rgb)).to.eql(hex);
    });
    
  });
    
});
