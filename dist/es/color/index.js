import * as R from 'ramda';
import { random } from "../number";
export var rgbToHsl = function rgbToHsl(_ref) {
  var r = _ref.r,
      g = _ref.g,
      b = _ref.b;
  r /= 255;
  g /= 255;
  b /= 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h,
      s,
      l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        h = (b - r) / d + 2;
        break;

      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: h * 360,
    s: s,
    l: l
  };
};
export var hslToRgb = function hslToRgb(_ref2) {
  var h = _ref2.h,
      s = _ref2.s,
      l = _ref2.l;
  h /= 360;
  var r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};
export var hexToRgb = function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};
export var rgbToHex = R.pipe(R.map(function (color) {
  var hex = color.toString(16);
  return hex.length === 1 ? "0".concat(hex) : hex;
}), function (_ref3) {
  var r = _ref3.r,
      g = _ref3.g,
      b = _ref3.b;
  return "#".concat(r).concat(g).concat(b);
});
export var hslToHex = R.pipe(hslToRgb, rgbToHex);
export var hexToHsl = R.pipe(hexToRgb, rgbToHsl);
export var randomRgb = function randomRgb() {
  return {
    r: random(0, 255),
    g: random(0, 255),
    b: random(0, 255)
  };
};
export var randomHex = R.pipe(randomRgb, rgbToHex);
export var randomHsl = R.pipe(randomRgb, rgbToHsl);