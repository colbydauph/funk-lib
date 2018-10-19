'use strict';

const R = require('ramda');

// ((A, T) -> Promise<A>) -> A -> Iterable<T> -> Promise<A>
const reduce = R.curry(async (pred, acc, iterable) => {
  for await (const item of iterable) acc = await pred(acc, item);
  return acc;
});

// (A -> Promise<B>) -> Iterable<A> -> AsyncIterator<B>
const map = R.curry(async function* map(pred, iterable) {
  for await (const item of iterable) {
    yield await pred(item);
  }
});

// Iterable<T> -> AsyncIterator<T>
const from = map(R.identity);

// create a async iterator from one or more (variadic) arguments
// T... -> AsyncIterator<T>
const of = R.unapply(from);

// Iterable<Number> -> Promise<Number>
const sum = reduce(R.add, 0);

// Iterable<T> -> Promise<Integer>
const length = reduce(R.add(1), 0);

// Iterable<T> -> Promise<T>
const next = async (iterable) => {
  const { value, done } = await iterable.next();
  if (done) throw Error('iterable exhausted');
  return value;
};

// (A -> Promise<Iterable<B>>) -> Iterable<A> -> AsyncIterator<B>
const flatMap = R.curry(async function* flatMap(pred, iterable) {
  for await (const item of iterable) {
    yield* await pred(item);
  }
});

// (T -> Promise<Boolean>) -> Iterable<T> -> AsyncIterator<T>
const filter = R.curry(async function* filter(pred, iterable) {
  for await (const item of iterable) {
    if (await pred(item)) yield item;
  }
});

// (T -> Promise<*>) -> Iterable<T> -> AsyncIterator<T>
const forEach = R.curry(async function* forEach(pred, iterable) {
  for await (const item of iterable) {
    await pred(item);
    yield item;
  }
});

// Iterable<T> -> Promise<[T]>
const toArray = async (iterable) => {
  const arr = [];
  for await (const item of iterable) arr.push(item);
  return arr;
};


module.exports = {
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
