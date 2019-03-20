// core
import crypto from 'crypto';

// module
import { curry } from 'ramda';


/** Hash with variable algorithm
  * @func
  * @sig String -> String -> String
  * @example hashWith('md5', 'hello'); // '5d41402abc4b2a76b9719d911017c592'
*/
export const hashWith = curry((algo, str) => crypto
  .createHash(algo)
  .update(str)
  .digest('hex'));

/** md5 hash a string
  * @func
  * @sig String -> String
  * @example md5('hello'); // '5d41402abc4b2a76b9719d911017c592'
*/
export const md5 = hashWith('md5');

/** sha256 hash a string
  * @func
  * @sig String -> String
  * @example sha256('hello'); // '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
*/
export const sha256 = hashWith('sha256');

/** sha512 hash a string
  * @func
  * @sig String -> String
*/
export const sha512 = hashWith('sha512');
