// core
import * as util from 'util';

// modules
import * as R from 'ramda';


// string -> string -> number
export const localeCompare = R.invoker(1, 'localeCompare');

// todo: deprecate these
// string -> string
export const toUpperCase = R.unary(util.deprecate(
  R.toUpper,
  'funk-lib/string/toUpperCase -> R.toUpper'
));
export const toLowerCase = R.unary(util.deprecate(
  R.toLower,
  'funk-lib/string/toLowerCase -> R.toLower'
));

// string -> string
export const capitalize = (str) => R.toUpper(R.nth(0, str)) + str.slice(1);

// string -> string
// eslint-disable-next-line no-useless-escape
export const escapeRegExpStr = R.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

// reasonably similar to js template literals
// string -> object -> string
export const template = R.curry((tmpl, variables) => {
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
export const toBase64 = encodeFrom('utf8', 'base64');
export const parseBase64 = encodeFrom('base64', 'utf8');

// string -> string
export const slugify = R.pipe(
  R.toLower,
  R.replace(/[^a-z0-9]/gi, '-'),
  R.replace(/-+/gi, '-'),
  R.replace(/^-|-$/gi, ''),
);
