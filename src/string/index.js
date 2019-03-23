// core
import { deprecate } from 'util';

// modules
import {
  curry,
  invoker,
  nth,
  pipe,
  replace,
  toLower,
  toUpper,
  unary,
} from 'ramda';

/** Locale compare
  * @func
  * @sig String → String → Number
*/
export const localeCompare = invoker(1, 'localeCompare');


export const toUpperCase = unary(deprecate(
  toUpper,
  'funk-lib/string/toUpperCase → R.toUpper'
));
export const toLowerCase = unary(deprecate(
  toLower,
  'funk-lib/string/toLowerCase → R.toLower'
));

/** Capitalize the first letter of a string
  * @func
  * @sig String → String
  * @example capitalize('hello'); // 'Hello'
*/
export const capitalize = (str) => toUpper(nth(0, str)) + str.slice(1);

// String → String
// eslint-disable-next-line no-useless-escape
export const escapeRegExpStr = replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

/** String interpolation. Reasonably similar to JavaScript template literals.
  * @func
  * @sig String → {*} → String
  * @example
  * // 'Hello Pat!'
  * template('Hello ${ name }!', { name: 'Pat' });
*/
export const template = curry((tmpl, variables) => {
  return tmpl.replace(/\${([\sA-Z0-9_$]+)}/gi, (_, variable) => {
    return variables[variable.trim()] || '';
  });
});

// https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings
// string → string → string → string
const encodeFrom = curry((from, to, string) => Buffer
  .from(string, from)
  .toString(to));

/** Encode a string to base64
  * @func
  * @sig String → String
  * @example toBase64('hello'); // 'aGVsbG8='
*/
export const toBase64 = encodeFrom('utf8', 'base64');

/** Decode a string from base64
  * @func
  * @sig String → String
  * @example parseBase64('aGVsbG8='); // 'hello'
*/
export const parseBase64 = encodeFrom('base64', 'utf8');

/** Slugify a string
  * @func
  * @sig String → String
  * @example slugify('Hello World!'); // 'hello-world'
*/
export const slugify = pipe(
  toLower,
  replace(/[^a-z0-9]/gi, '-'),
  replace(/-+/gi, '-'),
  replace(/^-|-$/gi, ''),
);

