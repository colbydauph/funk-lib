'use strict';

const R = require('ramda');

// * -> string
const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (placeholder) => {
    const rand = Math.random() * 16 | 0, val = placeholder === 'x' ? rand : (rand & 0x3 | 0x8);
    return val.toString(16);
  });
};

// * -> boolean
const isUuid = R.test(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

module.exports = {
  uuid,
  isUuid,
};
