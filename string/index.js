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

// https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings
// string -> string -> string -> string
const encodeFrom = R.curry((from, to, string) => Buffer
  .from(string, from)
  .toString(to));
  
// encode and decode base64 strings
// string -> string
const toBase64 = encodeFrom('utf8', 'base64');
const parseBase64 = encodeFrom('base64', 'utf8');

// const slugify =


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
