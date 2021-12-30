import * as R from 'ramda';

/** Parse a content-type HTTP header into its parts
  * @sig String → { mimeType, charset, boundary }
  * @example
  * // {
  * //  mimeType: 'multipart/form-data',
  * //  boundary: 'abc',
  * //  charset: 'utf-8',
  * // }
  * parseContentType('multipart/form-data; boundary=abc; charset=utf-8');
  * // { mimeType: 'multipart/form-data' }
  * parseContentType('multipart/form-data');
*/
export const parseContentType = R.pipe(
  R.defaultTo(''),
  R.split(/;\s*/),
  R.chain((str) => {
    const [left, right] = str.split('=');
    if (!left && !right) return [];
    return right ? [[left, right]] : [['mimeType', left]];
  }),
  R.fromPairs,
);
