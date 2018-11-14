'use strict';

const onSigInt = (handler) => {
  process.on('SIGINT', handler);
  // offSigInt
  return () => {
    process.removeListener('SIGINT', handler);
  };
};

module.exports = {
  onSigInt,
};
