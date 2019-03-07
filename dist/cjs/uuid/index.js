"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUuid = exports.uuid = void 0;

var _ramda = require("ramda");

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, placeholder => {
    const rand = Math.random() * 16 | 0,
          val = placeholder === 'x' ? rand : rand & 0x3 | 0x8;
    return val.toString(16);
  });
};

exports.uuid = uuid;
const isUuid = (0, _ramda.test)(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
exports.isUuid = isUuid;