// modules
import { test } from 'ramda';

const DATA_URL_REGEXP = /^data:([^;,]+)?(?:;([^,]+))?,(.+)$/;

/** Is a string a data url
  * @func
  * @sig a → Boolean
  * @example
  * isDataUrl('data:,Hello%2C%20World!'); // true
  * isDataUrl('https://foo.bar'); // false
*/
export const isDataUrl = test(DATA_URL_REGEXP);

/** Parse a data url into its parts
  * @func
  * @sig String → { mediatype, data, base64 }
  * @example
  * // {
  * //   base64: true,
  * //   data: 'eyJ0ZXN0IjoidGV4dCJ9',
  * //   mediatype: 'application/json',
  * // }
  * parseDataUrl('data:application/json;base64,eyJ0ZXN0IjoidGV4dCJ9');
*/
export const parseDataUrl = url => {
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

