"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slugify = exports.parseBase64 = exports.toBase64 = exports.template = exports.escapeRegExpStr = exports.capitalize = exports.toLowerCase = exports.toUpperCase = exports.localeCompare = void 0;

var _util = require("util");

var _ramda = require("ramda");

const localeCompare = (0, _ramda.invoker)(1, 'localeCompare');
exports.localeCompare = localeCompare;
const toUpperCase = (0, _ramda.unary)((0, _util.deprecate)(_ramda.toUpper, 'funk-lib/string/toUpperCase -> R.toUpper'));
exports.toUpperCase = toUpperCase;
const toLowerCase = (0, _ramda.unary)((0, _util.deprecate)(_ramda.toLower, 'funk-lib/string/toLowerCase -> R.toLower'));
exports.toLowerCase = toLowerCase;

const capitalize = str => (0, _ramda.toUpper)((0, _ramda.nth)(0, str)) + str.slice(1);

exports.capitalize = capitalize;
const escapeRegExpStr = (0, _ramda.replace)(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
exports.escapeRegExpStr = escapeRegExpStr;
const template = (0, _ramda.curry)((tmpl, variables) => {
  return tmpl.replace(/\${([\sA-Z0-9_$]+)}/gi, (_, variable) => {
    return variables[variable.trim()] || '';
  });
});
exports.template = template;
const encodeFrom = (0, _ramda.curry)((from, to, string) => Buffer.from(string, from).toString(to));
const toBase64 = encodeFrom('utf8', 'base64');
exports.toBase64 = toBase64;
const parseBase64 = encodeFrom('base64', 'utf8');
exports.parseBase64 = parseBase64;
const slugify = (0, _ramda.pipe)(_ramda.toLower, (0, _ramda.replace)(/[^a-z0-9]/gi, '-'), (0, _ramda.replace)(/-+/gi, '-'), (0, _ramda.replace)(/^-|-$/gi, ''));
exports.slugify = slugify;