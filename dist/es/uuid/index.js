import { test } from 'ramda';
export var uuid = function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (placeholder) {
    var rand = Math.random() * 16 | 0,
        val = placeholder === 'x' ? rand : rand & 0x3 | 0x8;
    return val.toString(16);
  });
};
export var isUuid = test(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);