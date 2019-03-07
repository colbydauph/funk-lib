"use strict";

var R = _interopRequireWildcard(require("ramda"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const yieldWith = R.curry((onYield, iterator) => {
  let value, done;

  while (!done) {
    try {
      ({
        value,
        done
      } = iterator.next(value));
      if (done) return value;
      value = onYield(value);
    } catch (err) {
      ({
        value,
        done
      } = iterator.throw(err));
      if (done) return value;
      value = onYield(value);
    }
  }
});
const yieldWithAsync = R.curry(async (onYield, iterator) => {
  let value, done;

  while (!done) {
    try {
      ({
        value,
        done
      } = await iterator.next(value));
      if (done) return value;
      value = await onYield(value);
    } catch (err) {
      ({
        value,
        done
      } = await iterator.throw(err));
      if (done) return value;
      value = await onYield(value);
    }
  }
});
module.exports = {
  yieldWith,
  yieldWithAsync
};