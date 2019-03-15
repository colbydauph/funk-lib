// core
import { Readable as ReadableStream } from 'stream';

/** stream to string
  * @func
  * @sig stream -> string
*/
export const toString = async stream => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    /* eslint-disable indent */
    stream.on('data', (chunk) => chunks.push(chunk.toString()))
          .on('end', () => resolve(chunks.join('')))
          .on('error', reject);
    /* eslint-enable indent */
  });
};

/** string to stream
  * @func
  * @sig string -> stream
*/
export const fromString = string => {
  const stream = new ReadableStream();
  // eslint-disable-next-line no-underscore-dangle
  stream._read = () => {};
  stream.push(string);
  stream.push(null);
  return stream;
};
