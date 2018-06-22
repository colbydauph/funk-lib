'use strict';

// modules
const R = require('ramda');

const localeCompare = R.invoker(1, 'localeCompare');
const toUpperCase = R.invoker(0, 'toUpperCase');
const toLowerCase = R.invoker(0, 'toLowerCase');
const charAt = R.invoker(1, 'charAt');
const capitalize = (str) => toUpperCase(charAt(0, str)) + str.slice(1);

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

// encode a string to base64
// string -> string
const toBase64 = (str) => Buffer.from(str).toString('base64');

// decode a base64 string
// string -> string
const parseBase64 = (base64str) => Buffer.from(base64str, 'base64').toString('utf8');


module.exports = {
  capitalize,
  charAt,
  escapeRegExpStr,
  localeCompare,
  parseBase64,
  template,
  toBase64,
  toLowerCase,
  toUpperCase,
};
