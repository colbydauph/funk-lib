// core
import crypto from 'crypto';

// module
import { curry } from 'ramda';


// string -> string -> string
export const hashWith = curry((algo, str) => crypto
  .createHash(algo)
  .update(str)
  .digest('hex'));

// string -> string

/** md5 hash
  * @func
  * @sig string -> string
*/
export const md5 = hashWith('md5');

/** sha256 hash
  * @func
  * @sig string -> string
*/
export const sha256 = hashWith('sha256');

/** sha512 hash
  * @func
  * @sig string -> string
*/
export const sha512 = hashWith('sha512');
