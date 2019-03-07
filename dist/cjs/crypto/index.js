"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sha512 = exports.sha256 = exports.md5 = exports.hashWith = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hashWith = (0, _ramda.curry)((algo, str) => _crypto.default.createHash(algo).update(str).digest('hex'));
exports.hashWith = hashWith;
const md5 = hashWith('md5');
exports.md5 = md5;
const sha256 = hashWith('sha256');
exports.sha256 = sha256;
const sha512 = hashWith('sha512');
exports.sha512 = sha512;