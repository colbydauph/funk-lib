// modules
import * as R from 'ramda';

const DATA_URL_REGEXP = /^data:([^;,]+)?(?:;([^,]+))?,(.+)$/;

// * -> boolean
export const isDataUrl = R.test(DATA_URL_REGEXP);

// dataurl -> { mediatype, data, base64 }
export const parseDataUrl = (url) => {
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
