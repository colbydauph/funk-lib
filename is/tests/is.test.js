'use strict';

// local
const { fromString } = require('../../stream');
const assert = require('./assert-is');
const {
  isAsyncGenerator,
  isAsyncGeneratorFunction,
  isBoolean,
  isDate,
  isFunction,
  isGenerator,
  isGeneratorFunction,
  isInstanceOf,
  isIterable,
  isNegative,
  isNull,
  isObject,
  isPojo,
  isPositive,
  isPromise,
  isRegExp,
  isStream,
  isSymbol,
  isSyncGenerator,
  isSyncGeneratorFunction,
  isTypeOf,
  isUndefined,
  isAsyncIterable,
} = require('..');

describe('is', () => {
  
  assert({
    func: isBoolean,
    name: 'isBoolean',
    fail: [1, {}, 0, () => {}, [], undefined, null],
    pass: [true, false],
  });
  
  assert({
    func: isDate,
    name: 'isDate',
    pass: [new Date()],
    fail: [{}, [], null, undefined, 1, false, () => {}],
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
      // async function* gen() {},
    ],
  });

  assert({
    func: isGenerator,
    name: 'isGenerator',
    fail: [
      () => {},
      async () => {},
      // async function* gen() {},
      {}, [], 1, true, null,
    ],
    pass: [
      (function* gen() {})(),
      // (async function* asyncGen() {})(),
    ],
  });
  
  assert({
    func: isSyncGenerator,
    name: 'isSyncGenerator',
    fail: [
      () => {},
      async () => {},
      // async function* gen() {},
      // (async function* asyncGen() {})(),
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
      // async function* gen() {},
      {}, [], 1, true, null,
    ],
    pass: [
      // (async function* asyncGen() {})(),
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
      // async function* asyncGen() {},
    ],
  });
  
  assert({
    func: isSyncGeneratorFunction,
    name: 'isSyncGeneratorFunction',
    fail: [
      () => {},
      async () => {},
      function GeneratorFunction() {},
      // async function* asyncGen() {},
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
      // async function* asyncGen() {},
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
    func: isAsyncIterable,
    name: 'isAsyncIterable',
    fail: [{}, true, null, undefined, 1, { * [Symbol.iterator]() {} }],
    pass: [
      { * [Symbol.asyncIterator]() {} },
    ],
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
    fail: [0, -0, Infinity, NaN, {}, [], false, true, undefined, () => {}],
    pass: [null],
  });
  
  assert({
    func: isObject,
    name: 'isObject',
    pass: [{}],
    fail: [[], null, undefined, 1, false, () => {}],
  });
  
  assert({
    func: isPojo,
    name: 'isPojo',
    pass: [
      {},
      Object.create(Object.prototype),
      // eslint-disable-next-line no-new-object
      new Object(),
    ],
    fail: [
      [],
      Array(),
      function test() {},
      new Date(),
      true,
      'abc',
      123,
      new RegExp(),
      null,
      undefined,
      Object.create({}),
      Object.assign(Object.create(null), {
        // hack to make serializable
        [Symbol.toPrimitive]: () => 'obj',
      }),
      new (function Foo() {})(),
    ],
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
    func: isRegExp,
    name: 'isRegExp',
    pass: [
      /a/,
      new RegExp('test'),
    ],
    fail: [
      {},
      () => {},
      true,
      [],
      1,
      new Date(),
    ],
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
    func: isSymbol,
    name: 'isSymbol',
    pass: [
      Symbol('test'),
    ],
    fail: [{}, () => {}, true, [], 1],
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
