'use strict';

// modules
const  R = require('ramda');

const DATA_URL_REGEXP = /^data:([^;,]+)?(?:;([^,]+))?,(.+)$/;

const isDataUrl = R.test(DATA_URL_REGEXP);

// dataurl -> { mediatype, data, base64 }
const parseDataUrl = (url) => {
  if (!isDataUrl(url)) return {};
  const [
    // eslint-disable-next-line no-unused-vars
    _,
    mediatype = 'text/plain;charset=US-ASCII',
    encoding,
    data,
  ] = DATA_URL_REGEXP.exec(url);

  const base64 = (encoding === 'base64');
  return { mediatype, data, base64 };
};

module.exports = {
  isDataUrl,
  parseDataUrl,
};
