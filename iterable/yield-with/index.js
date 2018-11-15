'use strict';

// modules
const R = require('ramda');

// (A -> B) -> Iterator<A> -> *
const yieldWith = R.curry((onYield, iterator) => {

  let value, done;
  while (!done) {
    
    try {
      ({ value, done } = iterator.next(value));
      if (done) return value;
      value = onYield(value);
      
    } catch (err) {
      ({ value, done } = iterator.throw(err));
      if (done) return value;
      value = onYield(value);
    }

  }
  
});

// (A -> B) -> AsyncIterator<A> -> *
const yieldWithAsync = R.curry(async (onYield, iterator) => {

  let value, done;
  while (!done) {
    
    try {
      ({ value, done } = await iterator.next(value));
      if (done) return value;
      value = await onYield(value);
      
    } catch (err) {
      ({ value, done } = await iterator.throw(err));
      if (done) return value;
      value = await onYield(value);
    }

  }
  
});

module.exports = {
  yieldWith,
  yieldWithAsync,
};
