'use strict';

const onSigInt = (handler) => {
  process.on('SIGINT', handler);
  return () => {
    process.removeListener('SIGINT', handler);
  };
};

module.exports = {
  onSigInt,
};
