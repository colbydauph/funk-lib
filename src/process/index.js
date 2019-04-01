/** On SIGINT
  * @func
  * @example
  * const offSigInt = onSigInt(_ => {
  *  console.log('SIGINT');
  *  offSigInt(); // unsubscribe
  * });
*/
export const onSigInt = handler => {
  process.on('SIGINT', handler);
  // offSigInt
  return () => {
    process.removeListener('SIGINT', handler);
  };
};
