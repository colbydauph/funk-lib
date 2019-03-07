export var onSigInt = function onSigInt(handler) {
  process.on('SIGINT', handler);
  return function () {
    process.removeListener('SIGINT', handler);
  };
};