/** On SIGINT
  * @func
*/
export const onSigInt = handler => {
  process.on('SIGINT', handler);
  // offSigInt
  return () => {
    process.removeListener('SIGINT', handler);
  };
};
