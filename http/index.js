'use strict';

const R = require('ramda');

// parse a content-type http header into its parts
// 'multipart/form-data; boundary=something; charset=utf-8' -> { mimeType, charset, boundary }
// string -> object
const parseContentType = R.pipe(
  R.defaultTo(''),
  R.split(/;\s*/),
  R.map((str) => {
    const [left, right] = str.split('=');
    if (!left && !right) return undefined;
    return right ? [left, right] : ['mimeType', left];
  }),
  // fixme: should not iterate a second time
  R.filter(R.identity),
  R.fromPairs
);

module.exports = {
  parseContentType,
};
