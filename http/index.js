'use strict';

const R = require('ramda');

// parse a content-type http header into its parts
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
// content-type -> { mimeType, charset, boundary }
// string -> object
const parseContentType = R.pipe(
  R.defaultTo(''),
  R.split(/;\s*/),
  R.chain((str) => {
    const [left, right] = str.split('=');
    if (!left && !right) return [];
    return right ? [[left, right]] : [['mimeType', left]];
  }),
  R.fromPairs,
);

module.exports = {
  parseContentType,
};
