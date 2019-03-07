import { deprecate } from 'util';
import { curry, invoker, nth, pipe, replace, toLower, toUpper, unary } from 'ramda';
export var localeCompare = invoker(1, 'localeCompare');
export var toUpperCase = unary(deprecate(toUpper, 'funk-lib/string/toUpperCase -> R.toUpper'));
export var toLowerCase = unary(deprecate(toLower, 'funk-lib/string/toLowerCase -> R.toLower'));
export var capitalize = function capitalize(str) {
  return toUpper(nth(0, str)) + str.slice(1);
};
export var escapeRegExpStr = replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
export var template = curry(function (tmpl, variables) {
  return tmpl.replace(/\${([\sA-Z0-9_$]+)}/gi, function (_, variable) {
    return variables[variable.trim()] || '';
  });
});
var encodeFrom = curry(function (from, to, string) {
  return Buffer.from(string, from).toString(to);
});
export var toBase64 = encodeFrom('utf8', 'base64');
export var parseBase64 = encodeFrom('base64', 'utf8');
export var slugify = pipe(toLower, replace(/[^a-z0-9]/gi, '-'), replace(/-+/gi, '-'), replace(/^-|-$/gi, ''));