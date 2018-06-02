'use strict';

// modules
const R = require('ramda');

// local
const { mapValues } = require('../object');

// string -> { r, g, b }
const hexToRgb = (hex) => {
  // expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  // eslint-disable-next-line id-length
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

// { r, g, b } -> string
// inverse of hexToRgb
const rgbToHex = R.pipe(
  mapValues((color) =>  {
    const hex = color.toString(16);
    return (hex.length === 1) ? `0${ hex }` : hex;
  }),
  // eslint-disable-next-line id-length
  ({ r, g, b }) => `#${ r }${ g }${ b }`,
);


module.exports = {
  hexToRgb,
  rgbToHex,
};
