import crypto from 'crypto';
import { curry } from 'ramda';
export var hashWith = curry(function (algo, str) {
  return crypto.createHash(algo).update(str).digest('hex');
});
export var md5 = hashWith('md5');
export var sha256 = hashWith('sha256');
export var sha512 = hashWith('sha512');