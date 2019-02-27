'use strict';

// local
const { fromString } = require('../../stream');
const assert = require('./assert-is');
const {
  is,
  isArray,
  isAsyncIterable,
  isBoolean,
  isBuffer,
  isDate,
  isFalsey,
  // isFinite,
  isFloat,
  isFunction,
  isInstanceOf,
  isInteger,
  isIterable,
  isIterator,
  isNaN,
  isNegative,
  isNot,
  isNull,
  isNumber,
  isObject,
  isPojo,
  isPositive,
  isPromise,
  isRegExp,
  isStream,
  isString,
  isSymbol,
  isTruthy,
  isTypeOf,
  isUndefined,
} = require('..');

describe('is', () => {
  
  assert('is', {
    func: is,
    spread: true,
    pass: [
      [1, 1],
      [true, true],
      (() => {
        const prop = [1, 2, 3];
        return [prop, prop];
      })(),
      (() => {
        const prop = { prop: true };
        return [prop, prop];
      })(),
    ],
    fail: [
      [1, 2],
      [true, false],
      [{}, []],
      [0, undefined],
      [null, undefined],
      [null, NaN],
      [NaN, NaN],
      [[1, 2, 3], [1, 2, 3]],
      [{ prop: true }, { prop: true }],
    ],
  });
  
  assert('isArray', {
    func: isArray,
    pass: [[], Array(1)],
    fail: [1, {}, 0, () => {}, undefined, null],
  });
  
  assert('isAsyncIterable', {
    func: isAsyncIterable,
    pass: [
      { * [Symbol.asyncIterator]() {} },
      (async function* gen() {})(),
    ],
    fail: [
      {}, [],
      true, null, undefined, 1,
      (function* gen() {})(),
      { * [Symbol.iterator]() {} },
      () => {},
    ],
  });
  
  assert('isBoolean', {
    func: isBoolean,
    pass: [true, false, Boolean(true)],
    fail: [
      1, 0,
      () => {}, {}, [],
      undefined, null,
      // eslint-disable-next-line no-new-wrappers
      new Boolean(true),
    ],
  });
  
  assert('isBuffer', {
    func: isBuffer,
    pass: [Buffer.from('test', 'utf8')],
    fail: [
      {}, [], () => {},
      null, undefined, 1, false,
      Date(), 'test',
    ],
  });
  
  assert('isDate', {
    func: isDate,
    pass: [new Date()],
    fail: [
      {}, [], Date(), () => {},
      null, undefined, 1, false,
    ],
  });
  
  assert('isFalsey', {
    func: isFalsey,
    pass: [null, undefined, false, 0, -0, 0x0, 0.0, '', NaN],
    fail: [1, true, [], {}, () => {}, 'test'],
  });
  
  assert('isFloat', {
    func: isFloat,
    pass: [1.1, 10.99999999, 1 / 3],
    fail: [1, 2, 10.0, Infinity, -Infinity, NaN, 0, -0],
  });
  
  assert('isFunction', {
    func: isFunction,
    pass: [
      () => {},
      async () => {},
      function func() {},
      function* gen() {},
      // async function* gen() {},
    ],
    fail: [1, {}, 0, true, [], undefined, null],
  });
  
  assert('isInstanceOf', {
    /* eslint-disable no-new-wrappers, no-array-constructor */
    func: isInstanceOf,
    spread: true,
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
    fail: [
      [Array, {}],
      [Number, 1],
      [Boolean, false],
      [String, ''],
    ],
    /* eslint-enable no-new-wrappers */
  });
  
  assert('isIterable', {
    func: isIterable,
    pass: [
      [],
      { * [Symbol.iterator]() {} },
      (function* gen() {})(),
    ],
    fail: [
      {}, true, null, undefined, 1,
      { * [Symbol.asyncIterator]() {} },
      (async function* gen() {})(),
      () => {},
    ],
  });
  
  assert('isIterator', {
    func: isIterator,
    pass: [
      (function* gen() {})(),
      (async function* asyncGen() {})(),
      { next: () => {} },
    ],
    fail: [
      {}, [],
      true, null, undefined, 1,
      () => {},
    ],
  });
  
  assert('isNaN', {
    func: isNaN,
    pass: [NaN],
    fail: [
      {}, [],
      true, null, undefined, 1,
      () => {},
    ],
  });
    
  assert('isNegative', {
    func: isNegative,
    pass: [-1, -100000, -Infinity],
    fail: [
      0, -0, 1, 1000000, Infinity, NaN,
      undefined, [], {}, true, null,
    ],
  });
  
  assert('isNot', {
    func: isNot,
    spread: true,
    pass: [
      [1, 2],
      [true, false],
      [{}, []],
      [0, undefined],
      [null, undefined],
      [null, NaN],
      [NaN, NaN],
      [[1, 2, 3], [1, 2, 3]],
      [{ prop: true }, { prop: true }],
    ],
    fail: [
      [1, 1],
      [true, true],
      (() => {
        const prop = [1, 2, 3];
        return [prop, prop];
      })(),
      (() => {
        const prop = { prop: true };
        return [prop, prop];
      })(),
    ],
  });
  
  assert('isNull', {
    func: isNull,
    pass: [null],
    fail: [0, -0, Infinity, NaN, {}, [], false, true, undefined, () => {}],
  });
  
  assert('isObject', {
    func: isObject,
    pass: [{}],
    fail: [[], null, undefined, 1, false, () => {}],
  });
  
  assert('isPojo', {
    func: isPojo,
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
  
  assert('isNumber', {
    func: isNumber,
    pass: [
      -Infinity, -100, -10.10, -0, 0, 10.10, 100, Infinity,
      Number(10),
    ],
    fail: [
      NaN,
      [], {}, () => {},
      true, false,
      // eslint-disable-next-line no-new-wrappers
      new Number(10),
    ],
  });
  
  assert('isInteger', {
    func: isInteger,
    pass: [-100, -0, 0, 100],
    fail: [
      -Infinity, Infinity, -10.10, 10.10, NaN,
      [], {}, true, false, () => {},
    ],
  });
  
  assert('isPositive', {
    func: isPositive,
    pass: [0, -0, 1, 1000000, Infinity, null],
    fail: [-1, -100000, -Infinity, NaN, undefined],
  });
  
  assert('isPromise', {
    func: isPromise,
    pass: [
      Promise.resolve(1),
      { then() {}, catch() {} },
    ],
    fail: [
      -1, -100000, -Infinity, NaN, undefined,
      {}, [], null,
      { then() {} },
      { catch() {} },
    ],
  });
  
  assert('isRegExp', {
    func: isRegExp,
    pass: [/a/, new RegExp('test')],
    fail: [
      {}, [], () => {},
      true, 1,
      new Date(),
    ],
  });
  
  assert('isStream', {
    func: isStream,
    pass: [fromString('test string')],
    fail: [{}, () => {}, true, [], 1, ''],
  });
  
  assert('isString', {
    func: isString,
    pass: ['', 'test', String('test')],
    fail: [
      {}, [], () => {},
      true, 1,
      // eslint-disable-next-line no-new-wrappers
      new String('test'),
    ],
  });
  
  assert('isSymbol', {
    func: isSymbol,
    pass: [Symbol('test')],
    fail: [{}, () => {}, true, [], 1],
  });
  
  assert('isTruthy', {
    func: isTruthy,
    pass: [1, true, [], {}, () => {}, 'test'],
    fail: [null, undefined, false, 0, -0, 0x0, 0.0, '', NaN],
  });
  
  assert('isTypeOf', {
    func: isTypeOf,
    spread: true,
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
    fail: [
      ['string', true],
      ['object', false],
      ['number', []],
      ['array', []],
      ['null', null],
      ['undefined', null],
    ],
  });
  
  assert('isUndefined', {
    func: isUndefined,
    pass: [undefined],
    fail: [0, -0, Infinity, NaN, {}, [], false, true, null, () => {}],
  });
    
});
