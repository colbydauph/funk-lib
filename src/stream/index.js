// core
import { Readable as ReadableStream } from 'stream';

/** Readable stream from iterable
  * @func
  * @sig Iterable a → Stream a
  * @example
  * from([1, 2, 3]); // ReadableStream(1, 2, 3)
*/
const from = iterable => {
  const stream = new ReadableStream();
  for (const item of iterable) stream.push(item);
  stream.push(null);
  return stream;
};

/** Stream to string
  * @func
  * @sig Stream String → String
  * @example
  * await toString(from(['a', 'b', 'c'])); // 'abc'
*/
export const toString = async stream => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    /* eslint-disable indent */
    stream.on('data', chunk => chunks.push(chunk.toString()))
          .on('end', () => resolve(chunks.join('')))
          .on('error', reject);
    /* eslint-enable indent */
  });
};

/** String to stream
  * @func
  * @sig String → Stream String
  * @example
  * fromString('hello'); // ReadableStream('hello')
*/
export const fromString = string => from([string]);
