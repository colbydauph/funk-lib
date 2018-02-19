'use strict';

// modules
const R = require('ramda');

const localeCompare = R.invoker(1, 'localeCompare');
const toUpperCase = R.invoker(0, 'toUpperCase');
const charAt = R.invoker(1, 'charAt');
const capitalize = (str) => toUpperCase(charAt(0, str)) + str.slice(1);

// string -> string
// eslint-disable-next-line no-useless-escape
const escapeRegExpStr = R.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

// string templates matching(ish) js template literals
// template('my name is ${ name }', { name: 'John' })
// string -> object -> string
const template = R.curry((tmpl, variables) => {
  return tmpl.replace(/\${([\sA-Z0-9_$]+)}/gi, (match, variable) => {
    return variables[variable.trim()] || '';
  });
});


module.exports = {
  escapeRegExpStr,
  localeCompare,
  capitalize,
  charAt,
  toUpperCase,
  template,
};
