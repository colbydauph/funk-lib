'use strict';

const R = require('ramda');

// inclusive bounds
// num -> num -> num
const random = R.curry((min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
});


module.exports = {
  random,
};
