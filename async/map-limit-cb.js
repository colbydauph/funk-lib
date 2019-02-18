'use strict';

// https://github.com/hughsk/map-limit
// eslint-disable-next-line max-statements
module.exports = (arr, limit, iterator, callback) => {
  let complete = 0;
  let aborted = false;
  const results = [];
  let queued = 0;
  const len = arr.length;
  let index = 0;


  const abort = err => {
    aborted = true;
    return callback(err);
  };
  
  flush();
  
  function flush() {
    if (complete === len) return callback(null, results);

    while (queued < limit) {
      if (aborted || (index === len)) break;
      push();
    }
  }

  function push() {
    const idx = index++;
    queued++;

    iterator(arr[idx], (err, result) => {
      if (err) return abort(err);
      results[idx] = result;
      complete += 1;
      queued -= 1;
      flush();
    });
  }
};
