function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import { expect } from 'chai';

var safeToString = function safeToString(thing) {
  return _typeof(thing) === 'symbol' ? thing.toString() : thing;
};

module.exports = function (name, _ref) {
  var func = _ref.func,
      _ref$pass = _ref.pass,
      passes = _ref$pass === void 0 ? [] : _ref$pass,
      _ref$fail = _ref.fail,
      fails = _ref$fail === void 0 ? [] : _ref$fail,
      _ref$spread = _ref.spread,
      spread = _ref$spread === void 0 ? false : _ref$spread;
  describe(name, function () {
    passes.forEach(function (pass) {
      var safe = safeToString(pass);
      it("should return true for: ".concat(safe), function () {
        pass = spread ? pass : [pass];
        expect(func.apply(void 0, _toConsumableArray(pass))).to.eql(true, "expected ".concat(name, "(").concat(safe, ") to equal ", true));
      });
    });
    fails.forEach(function (fail) {
      var safe = safeToString(fail);
      it("should return false for: ".concat(safe), function () {
        fail = spread ? fail : [fail];
        expect(func.apply(void 0, _toConsumableArray(fail))).to.eql(false, "expected ".concat(name, "(").concat(safe, ") to equal ", false));
      });
    });
  });
};