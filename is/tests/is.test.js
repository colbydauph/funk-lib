'use strict';

// local
const assert = require('./assert-is');
const {
  isBoolean,
  isFunction,
  isGenerator,
  isInstanceOf,
  isIterable,
  isNegative,
  isNull,
  isObject,
  isPositive,
  isPromise,
  isTypeOf,
  isUndefined,
} = require('..');

describe('is', () => {
  
  assert({
    func: isBoolean,
    name: 'isBoolean',
    fail: [1, {}, 0, () => {}, [], undefined, null],
    pass: [true, false],
  });
  
  assert({
    func: isFunction,
    name: 'isFunction',
    fail: [1, {}, 0, true, [], undefined, null],
    pass: [
      () => {},
      async () => {},
      function* gen() {},
    ],
  });
  
  assert({
    func: isGenerator,
    name: 'isGenerator',
    fail: [() => {}, {}, async () => {}, {}, [], 1, true, null],
    pass: [function* gen() {}],
  });
  
  
  assert({
    /* eslint-disable no-new-wrappers, no-array-constructor */
    func: isInstanceOf,
    name: 'isInstanceOf',
    fail: [
      [Array, {}],
      [Number, 1],
      [Boolean, false],
      [String, ''],
    ],
    pass: [
      [Object, {}],
      [Object, []],
      [Array, []],
      [Boolean, new Boolean(0)],
      [Number, new Number(0)],
      [String, new String('test')],
      [Array, Array()],
      [Object, Object()],
    ],
    spread: true,
    /* eslint-enable no-new-wrappers */
  });
  
  assert({
    func: isIterable,
    name: 'isIterable',
    fail: [{}, true, null],
    pass: [[], { * [Symbol.iterator]() {} }],
  });
  
  assert({
    func: isNegative,
    name: 'isNegative',
    fail: [0, -0, 1, 1000000, Infinity, NaN, undefined, [], {}, true, null],
    pass: [-1, -100000, -Infinity],
  });
  
  assert({
    func: isNull,
    name: 'isNull',
    fail: [0, -0, Infinity, NaN, {}, [], false, true, undefined],
    pass: [null],
  });
  
  assert({
    func: isObject,
    name: 'isObject',
    pass: [{}],
    fail: [[], null, undefined, 1, false, () => {}],
  });
    
  assert({
    func: isPositive,
    name: 'isPositive',
    pass: [0, -0, 1, 1000000, Infinity, null],
    fail: [-1, -100000, -Infinity, NaN, undefined],
  });
  
  assert({
    func: isPromise,
    name: 'isPromise',
    pass: [
      Promise.resolve(1),
      { then() {} },
    ],
    fail: [-1, -100000, -Infinity, NaN, undefined, {}, [], null, { catch() {} }],
  });
  
  assert({
    func: isTypeOf,
    name: 'isTypeOf',
    fail: [
      ['string', true],
      ['object', false],
      ['number', []],
      ['array', []],
      ['null', null],
      ['undefined', null],
    ],
    pass: [
      ['number', 1],
      ['object', {}],
      ['object', []],
      ['boolean', true],
      ['function', () => {}],
      ['function', async () => {}],
      ['function', function* gen() {}],
      ['object', null],
      ['number', NaN],
      ['string', 'test'],
      ['undefined', undefined],
    ],
    spread: true,
  });
  
  assert({
    func: isUndefined,
    name: 'isUndefined',
    fail: [0, -0, Infinity, NaN, {}, [], false, true, null, () => {}],
    pass: [undefined],
  });
    
});
