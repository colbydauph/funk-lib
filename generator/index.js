'use strict';

// modules
const R = require('ramda');

const yieldWith = R.curry(async (onYield, gen) => {

  let value, done;
  while (!done) {
    
    try {
      ({ value, done } = await gen.next(value));
      if (done) return value;
      value = await onYield(value);
      
    } catch (err) {
      ({ value, done } = await gen.throw(err));
      if (done) return value;
      value = await onYield(value);
    }

  }
  
});

module.exports = {
  yieldWith,
  // yieldWithSync,
};
