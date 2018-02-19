'use strict';

// modules
const R = require('ramda');

// picks values out of an object, whilst renaming their keys in result
// pickAs({ a: 'b', b: 'a' }, { a: 1, b: 2, c: 3 }) === { a: 2, b: 1 }
// object -> object -> object
const pickAs = R.curry((keyVals, obj) => {
  return R.toPairs(keyVals).reduce((result, [key, val]) => {
    return R.assoc(val, obj[key], result);
  }, {});
});

// todo: pickAsDeep (recursive)

module.exports = {
  pickAs,
};
