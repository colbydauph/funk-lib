"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onSigInt = void 0;

const onSigInt = handler => {
  process.on('SIGINT', handler);
  return () => {
    process.removeListener('SIGINT', handler);
  };
};

exports.onSigInt = onSigInt;