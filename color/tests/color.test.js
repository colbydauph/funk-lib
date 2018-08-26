'use strict';

// modules
const { expect } = require('chai');

// local
const {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToHex,
  hslToRgb,
  hexToHsl,
} = require('..');

const RGB_TO_HSL = [
  [{ r: 0, g: 51, b: 255 }, { h: 228, s: 1, l: 0.5 }],
  [{ r: 255, g: 255, b: 255 }, { h: 0, s: 0, l: 1 }],
  [{ r: 255, g: 0, b: 0 }, { h: 0, s: 1, l: 0.5 }],
  [{ r: 0, g: 255, b: 0 }, { h: 120, s: 1, l: 0.5 }],
];

const HSL_TO_HEX = [
  [{ h: 228, s: 1, l: 0.5 }, '#0033ff'],
  [{ h: 0, s: 0, l: 1 }, '#ffffff'],
  [{ h: 0, s: 1, l: 0.5 }, '#ff0000'],
  [{ h: 120, s: 1, l: 0.5 }, '#00ff00'],
];

const HEX_TO_RGB = [
  ['#0033FF', { r: 0, g: 51, b: 255 }],
  ['#02A', { r: 0, g: 34, b: 170 }],
  ['ab0ab0', { r: 171, g: 10, b: 176 }],
];

const RGB_TO_HEX = [
  [{ r: 0, g: 51, b: 255 }, '#0033ff'],
  [{ r: 0, g: 34, b: 170 }, '#0022aa'],
  [{ r: 171, g: 10, b: 176 }, '#ab0ab0'],
];

describe('color lib', () => {
  
  describe('hexToRgb', () => {
    
    it('should convert hex to rgb', () => {
      HEX_TO_RGB.forEach(([hex, rgb]) => {
        expect(hexToRgb(hex)).to.eql(rgb);
      });
    });
    
  });
  
  describe('rgbToHex', () => {
    
    it('should convert rgb to hex', () => {
      RGB_TO_HEX.forEach(([rgb, hex]) => {
        expect(rgbToHex(rgb)).to.eql(hex);
      });
    });
    
  });
  
  describe('rgbToHsl', () => {
    
    it('should convert rgb to hsl', () => {
      RGB_TO_HSL.forEach(([rgb, hsl]) => {
        expect(rgbToHsl(rgb)).to.eql(hsl);
      });
    });
    
    it('should be the inverse of hslToRgb', () => {
      RGB_TO_HSL.forEach(([rgb]) => {
        expect(hslToRgb(rgbToHsl(rgb))).to.eql(rgb);
      });
    });
    
  });
  
  describe('hslToRgb', () => {
    
    it('should convert hsl to rgb', () => {
      RGB_TO_HSL.forEach(([rgb, hsl]) => {
        expect(hslToRgb(hsl)).to.eql(rgb);
      });
    });
    
    it('should be the inverse of rgbToHsl', () => {
      RGB_TO_HSL.forEach(([_, hsl]) => {
        expect(rgbToHsl(hslToRgb(hsl))).to.eql(hsl);
      });
    });
    
  });
    
  describe('hslToHex', () => {
    
    it('should convert hsl to hex', () => {
      HSL_TO_HEX.forEach(([hsl, hex]) => {
        expect(hslToHex(hsl)).to.eql(hex);
      });
    });
    
    it('should be the inverse of hexToHsl', () => {
      HSL_TO_HEX.forEach(([hsl]) => {
        expect(hexToHsl(hslToHex(hsl))).to.eql(hsl);
      });
    });
    
  });
  
  describe('hexToHsl', () => {
    
    it('should convert hex to hsl', () => {
      HSL_TO_HEX.forEach(([hsl, hex]) => {
        expect(hexToHsl(hex)).to.eql(hsl);
      });
    });
    
    it('should be the inverse of hslToHex', () => {
      HSL_TO_HEX.forEach(([_, hex]) => {
        expect(hslToHex(hexToHsl(hex))).to.eql(hex);
      });
    });
    
  });
  
});
