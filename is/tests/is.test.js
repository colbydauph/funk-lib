'use strict';

// local
const { fromString } = require('../../stream');
const assert = require('./assert-is');
const {
  isAsyncGenerator,
  isAsyncGeneratorFunction,
  isBoolean,
  isFunction,
  isGenerator,
  isGeneratorFunction,
  isInstanceOf,
  isIterable,
  isNegative,
  isNull,
  isObject,
  isPositive,
  isPromise,
  isStream,
  isSyncGenerator,
  isSyncGeneratorFunction,
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
      function func() {},
      function* gen() {},
      async function* gen() {},
    ],
  });
  
  assert({
    func: isGenerator,
    name: 'isGenerator',
    fail: [
      () => {},
      async () => {},
      async function* gen() {},
      {}, [], 1, true, null,
    ],
    pass: [
      (function* gen() {})(),
      (async function* asyncGen() {})(),
    ],
  });
  
  assert({
    func: isSyncGenerator,
    name: 'isSyncGenerator',
    fail: [
      () => {},
      async () => {},
      async function* gen() {},
      (async function* asyncGen() {})(),
      {}, [], 1, true, null,
    ],
    pass: [
      (function* gen() {})(),
    ],
  });
  
  assert({
    func: isAsyncGenerator,
    name: 'isAsyncGenerator',
    fail: [
      () => {},
      async () => {},
      function* gen() {},
      (function* gen() {})(),
      async function* gen() {},
      {}, [], 1, true, null,
    ],
    pass: [
      (async function* asyncGen() {})(),
    ],
  });
  
  assert({
    func: isGeneratorFunction,
    name: 'isGeneratorFunction',
    fail: [
      () => {},
      async () => {},
      function GeneratorFunction() {},
      {}, [], 1, true, null,
    ],
    pass: [
      function* gen() {},
      async function* asyncGen() {},
    ],
  });
  
  assert({
    func: isSyncGeneratorFunction,
    name: 'isSyncGeneratorFunction',
    fail: [
      () => {},
      async () => {},
      function GeneratorFunction() {},
      async function* asyncGen() {},
      {}, [], 1, true, null,
    ],
    pass: [
      function* gen() {},
    ],
  });
  
  assert({
    func: isAsyncGeneratorFunction,
    name: 'isAsyncGeneratorFunction',
    fail: [
      () => {},
      async () => {},
      function AsyncGeneratorFunction() {},
      function* gen() {},
      {}, [], 1, true, null,
    ],
    pass: [
      async function* asyncGen() {},
    ],
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
    fail: [{}, true, null, undefined, 1],
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
    func: isStream,
    name: 'isStream',
    fail: [{}, () => {}, true, [], 1],
    pass: [
      fromString('test string'),
    ],
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
