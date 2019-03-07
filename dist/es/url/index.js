function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { test } from 'ramda';
var DATA_URL_REGEXP = /^data:([^;,]+)?(?:;([^,]+))?,(.+)$/;
export var isDataUrl = test(DATA_URL_REGEXP);
export var parseDataUrl = function parseDataUrl(url) {
  var _DATA_URL_REGEXP$exec = DATA_URL_REGEXP.exec(url),
      _DATA_URL_REGEXP$exec2 = _slicedToArray(_DATA_URL_REGEXP$exec, 4),
      _ = _DATA_URL_REGEXP$exec2[0],
      _DATA_URL_REGEXP$exec3 = _DATA_URL_REGEXP$exec2[1],
      mediatype = _DATA_URL_REGEXP$exec3 === void 0 ? 'text/plain;charset=US-ASCII' : _DATA_URL_REGEXP$exec3,
      encoding = _DATA_URL_REGEXP$exec2[2],
      data = _DATA_URL_REGEXP$exec2[3];

  var base64 = encoding === 'base64';
  return {
    mediatype: mediatype,
    data: data,
    base64: base64
  };
};