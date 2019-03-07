function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import { Readable as ReadableStream } from 'stream';
export var toString = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(stream) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var chunks = [];
              stream.on('data', function (chunk) {
                return chunks.push(chunk.toString());
              }).on('end', function () {
                return resolve(chunks.join(''));
              }).on('error', reject);
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function toString(_x) {
    return _ref.apply(this, arguments);
  };
}();
export var fromString = function fromString(string) {
  var stream = new ReadableStream();

  stream._read = function () {};

  stream.push(string);
  stream.push(null);
  return stream;
};