'use strict';

// core
const util = require('util');

// modules
const R = require('ramda');

// string -> string -> number
const localeCompare = R.invoker(1, 'localeCompare');

// todo: deprecate these
// string -> string
const toUpperCase = R.unary(util.deprecate(
  R.toUpper,
  'funk-lib/string/toUpperCase -> R.toUpper'
));
const toLowerCase = R.unary(util.deprecate(
  R.toLower,
  'funk-lib/string/toLowerCase -> R.toLower'
));

// string -> string
const capitalize = (str) => R.toUpper(R.nth(0, str)) + str.slice(1);

// string -> string
// eslint-disable-next-line no-useless-escape
const escapeRegExpStr = R.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

// reasonably similar to js template literals
// string -> object -> string
const template = R.curry((tmpl, variables) => {
  return tmpl.replace(/\${([\sA-Z0-9_$]+)}/gi, (_, variable) => {
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

// string -> string
const slugify = R.pipe(
  R.toLower,
  R.replace(/[^a-z0-9]/gi, '-'),
  R.replace(/-+/gi, '-'),
  R.replace(/^-|-$/gi, ''),
);


module.exports = {
  capitalize,
  escapeRegExpStr,
  localeCompare,
  parseBase64,
  template,
  toBase64,
  toLowerCase,
  toUpperCase,
  slugify,
};
