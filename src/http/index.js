import {
  chain,
  defaultTo,
  fromPairs,
  pipe,
  split,
} from 'ramda';

/** Parse a content-type HTTP header into its parts
  * @sig String → { mimeType, charset, boundary }
  * @example
  * // {
  * //  mimeType: 'multipart/form-data',
  * //  boundary: 'abc',
  * //  charset: 'utf-8',
  * // }
  * parseContentType('multipart/form-data; boundary=abc; charset=utf-8');
*/
export const parseContentType = pipe(
  defaultTo(''),
  split(/;\s*/),
  chain((str) => {
    const [left, right] = str.split('=');
    if (!left && !right) return [];
    return right ? [[left, right]] : [['mimeType', left]];
  }),
  fromPairs,
);
