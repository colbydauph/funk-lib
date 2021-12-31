
export const deprecate = (fn, msg, code) => {
  let warned = false;
  return function deprecated(...args) {
    if (!warned) {
      // eslint-disable-next-line no-console
      console.warn(`(browser) ${ code ? `[${ code }] ` : '' }DeprecationWarning: ${ msg }`);
      warned = true;
    }
    return fn(...args);
  };
};
