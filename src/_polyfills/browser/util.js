
export const deprecate = (fn, msg, code) => (...args) => {
  // eslint-disable-next-line no-console
  console.warn(`(browser) ${ code ? `[${ code }] ` : '' }DeprecationWarning: ${ msg }`);
  return fn(...args);
};
