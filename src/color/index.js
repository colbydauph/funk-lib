/* eslint-disable id-length, max-statements */

// modules
import * as R from 'ramda';

// aliased
import { random } from 'funk-lib/number';


/** RGB to HSL
  * @func
  * @sig { r, g, b } -> { h, s, l }
*/
export const rgbToHsl = ({ r, g, b }) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  // eslint-disable-next-line prefer-const
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = (max - min);
    s = (l > 0.5)
      ? d / (2 - max - min)
      : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return { h: (h * 360), s, l };
};


/** HSL to RGB
  * @func
  * @sig { h, s, l } -> { r, g, b }
*/
export const hslToRgb = ({ h, s, l }) => {
  h /= 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

/** Hex to RGB
  * @func
  * @sig String -> { r, g, b }
*/
export const hexToRgb = (hex) => {
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

/** RGB to hex
  * @func
  * @todo: should this not include the hash prefix?
  * @sig { r, g, b } -> String
*/
export const rgbToHex = R.pipe(
  R.map(color =>  {
    const hex = color.toString(16);
    return (hex.length === 1) ? `0${ hex }` : hex;
  }),
  ({ r, g, b }) => `#${ r }${ g }${ b }`,
);

/** HSL to hex
  * @func
  * @sig { h, s, l } -> String
*/
export const hslToHex = R.pipe(hslToRgb, rgbToHex);

/** Hex to HSL
  * @func
  * @sig String -> { h, s, l }
*/
export const hexToHsl = R.pipe(hexToRgb, rgbToHsl);

/** Get a random RGB value
  * @func
  * @sig * -> { r, g, b }
  * @example randomRgb(); // { r: 35, g: 125, b: 106 }
*/
export const randomRgb = () => ({
  r: random(0, 255),
  g: random(0, 255),
  b: random(0, 255),
});

/** Get a random hex string
  * @func
  * @sig * -> String
  * @example randomHex(); // #b3a95a
*/
export const randomHex = R.pipe(randomRgb, rgbToHex);

/** Get a random HSL value
  * @func
  * @sig * -> { h, s, l }
*/
export const randomHsl = R.pipe(randomRgb, rgbToHsl);

