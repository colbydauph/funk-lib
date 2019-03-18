// core
import crypto from 'crypto';

// module
import { curry } from 'ramda';


// String -> String -> String
export const hashWith = curry((algo, str) => crypto
  .createHash(algo)
  .update(str)
  .digest('hex'));

// String -> String

/** md5 hash
  * @func
  * @sig String -> String
*/
export const md5 = hashWith('md5');

/** sha256 hash
  * @func
  * @sig String -> String
*/
export const sha256 = hashWith('sha256');

/** sha512 hash
  * @func
  * @sig String -> String
*/
export const sha512 = hashWith('sha512');
