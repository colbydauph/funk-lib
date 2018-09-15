'use strict';

const R = require('ramda');

// ((A, T) -> A) -> AsyncIterable<T> -> A -> A
const reduce = R.curry(async (pred, acc, iterable) => {
  for await (const item of iterable) acc = await pred(acc, item);
  return acc;
});

// (A -> B) -> AsyncIterable<A> -> AsyncIterable<B>
const map = R.curry(async function* map(pred, iterable) {
  for await (const item of iterable) {
    yield await pred(item);
  }
});

// Array<T> -> Iterable<T>
const from = map(R.identity);

// create a async iterator from one or more (variadic) arguments
// T -> AsyncIterable<T>
const of = R.unapply(from);

// Iterable<N> -> N
const sum = reduce(R.add, 0);

// AsyncIterable<T> -> Number
const length = reduce(R.add(1), 0);

// AsyncIterable<T> -> T
const next = async (iterable) => {
  const { value, done } = await iterable.next();
  if (done) throw Error('iterable exhausted');
  return value;
};

// (T *-> T) -> Iterable<T> -> AsyncIterable<T>
const flatMap = R.curry(async function* flatMap(pred, iterable) {
  for await (const item of iterable) {
    yield* await pred(item);
  }
});

// (T -> Boolean) -> AsyncIterable<T> -> AsyncIterable<T>
const filter = R.curry(async function* filter(pred, iterable) {
  for await (const item of iterable) {
    if (await pred(item)) yield item;
  }
});

// (T -> *) -> Iterable<T> -> Iterable<T>
const forEach = R.curry(async function* forEach(pred, iterable) {
  for await (const item of iterable) {
    await pred(item);
    yield item;
  }
});

// AsyncIterable<T> -> Array<T>
const toArray = async function* toArray(iterable) {
  const arr = [];
  for await (const item of iterable) arr.push(item);
  return arr;
};

// Integer -> Iterable<T> -> Iterable<T>
// useWith(forEach, [(ms) => R.always(delay(ms)),  R.identity])
// const delay = R.curry(async function* delay(ms, iterable) {
//   yield* forEach(() => delay(ms), iterable);
// });



module.exports = {
  // delay,
  filter,
  flatMap,
  forEach,
  from,
  length,
  map,
  next,
  of,
  sum,
  toArray,
};
