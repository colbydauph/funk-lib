'use strict';

const R = require('ramda');

// https://github.com/fitzgen/wu.js/

// (A -> B) -> AsyncIterable<A> -> AsyncIterable<B>
const map = R.curry(async function* map(pred, iterable) {
  for await (const item of iterable) {
    yield await pred(item);
  }
});

// (A -> B) -> Iterable<A> -> Iterable<B>
const mapSync = R.curry(function* mapSync(pred, iterable) {
  for (const item of iterable) yield pred(item);
});

// (T -> *) -> Iterable<T> -> Iterable<T>
const forEachSync = R.curry(async (pred, iterable) => {
  for await (const item of iterable) {
    await pred(item);
  }
});

// (T -> Boolean) -> AsyncIterable<T> -> AsyncIterable<T>
const filter = R.curry(async function* filter(pred, iterable) {
  for await (const item of iterable) {
    if (await pred(item)) yield item;
  }
});

// (T -> Boolean) -> Iterable<T> -> Iterable<T>
const filterSync = R.curry(function* filterSync(pred, iterable) {
  for (const item of iterable) {
    if (pred(item)) yield item;
  }
});

// todo: figure out how to annotate these types
const flatMapSync = R.curry(function* flatMapSync(pred, iterable) {
  for (const item of iterable) yield* pred(item);
});

// Number -> Number -> Iterable<T>
const rangeSync = R.curry(function* rangeSync(start, end) {
  while (start < end) yield start++;
});

const sliceSync = () => {};
const countWhere = () => {};
const takeWhileSync = () => {};
const dropWhileSync = () => {};

// Number -> Iterable<T> -> Iterable<T>
const takeSync = R.curry(function* takeSync(num, iterable) {
  let i = 0;
  for (const item of iterable) {
    yield item;
    if (++i >= num) return;
  }
});

// Number -> Iterable<T> -> Iterable<T>
const dropSync = R.curry(function* takeSync(num, iterable) {
  let i = 0;
  for (const item of iterable) {
    if (++i > num) yield item;
  }
});

// Iterable<T> -> T
const nextSync = (iterable) => {
  const { value, done } = iterable.next();
  if (done) throw Error('oops');
  return value;
};

// Iterable<T> -> Number
const length = (iterable) => {
  let count;
  for (const _ of iterable) count++;
  return count;
};

// Iterable<T> -> Array<T>
const toArraySync = Array.from;

// Array<T> -> Iterable<T>
const fromArraySync = mapSync(R.identity);

// ((A, T) -> A) -> Iterable<T> -> A -> A
const reduceSync = R.curry((pred, acc, iterable) => {
  for (const item of iterable) acc = pred(acc, item);
  // yield acc;
  return acc;
});

module.exports = {
  dropSync,
  filter,
  filterSync,
  forEachSync,
  flatMapSync,
  fromArraySync,
  map,
  mapSync,
  nextSync,
  rangeSync,
  reduceSync,
  takeSync,
  toArraySync,
};
