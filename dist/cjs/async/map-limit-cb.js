"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (arr, limit, iterator, callback) => {
  const abort = (err, state) => {
    state.aborted = true;
    return callback(err);
  };

  const flush = (push, state) => {
    if (state.complete === state.len) return callback(null, state.results);

    while (state.queued < limit) {
      if (state.aborted || state.index === state.len) break;
      push(flush, state);
    }
  };

  function push(flush, state) {
    const {
      index: i
    } = state;
    state.index++;
    state.queued++;
    iterator(arr[i], (err, result) => {
      if (err) return abort(err, state);
      state.results[i] = result;
      state.complete += 1;
      state.queued -= 1;
      flush(push, state);
    });
  }

  flush(push, {
    complete: 0,
    aborted: false,
    results: [],
    queued: 0,
    len: arr.length,
    index: 0
  });
};

exports.default = _default;