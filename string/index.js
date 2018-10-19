'use strict';

// modules
const R = require('ramda');

// string -> string -> number
const localeCompare = R.invoker(1, 'localeCompare');
// string -> string
const toUpperCase = R.invoker(0, 'toUpperCase');
// string -> string
const toLowerCase = R.invoker(0, 'toLowerCase');
// string -> string
const capitalize = (str) => toUpperCase(R.nth(0, str)) + str.slice(1);

// string -> string
// eslint-disable-next-line no-useless-escape
const escapeRegExpStr = R.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

// reasonably similar to js template literals
// string -> object -> string
const template = R.curry((tmpl, variables) => {
  return tmpl.replace(/\${([\sA-Z0-9_$]+)}/gi, (match, variable) => {
    return variables[variable.trim()] || '';
  });
});

// string -> string -> string -> string
const convertString = R.curry((from, to, str) => Buffer.from(str, from).toString(to));

// encode a string to base64
// string -> string
const toBase64 = convertString('utf8', 'base64');

// decode a base64 string
// string -> string
const parseBase64 = convertString('base64', 'utf8');


module.exports = {
  capitalize,
  escapeRegExpStr,
  localeCompare,
  parseBase64,
  template,
  toBase64,
  toLowerCase,
  toUpperCase,
};
