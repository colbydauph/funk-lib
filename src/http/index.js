import {
  chain,
  defaultTo,
  fromPairs,
  pipe,
  split,
} from 'ramda';

/** Parse a content-type HTTP header into its parts
  * @sig String → { mimeType, charset, boundary }
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
