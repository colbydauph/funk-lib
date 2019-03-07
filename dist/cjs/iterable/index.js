"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sync = exports.async = void 0;

var _async = _interopRequireWildcard(require("./async"));

exports.async = _async;

var _sync = _interopRequireWildcard(require("./sync"));

exports.sync = _sync;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }