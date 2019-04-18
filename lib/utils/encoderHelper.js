"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAbstractCodec = exports.size = undefined;

var _is_js = require("is_js");

var _is_js2 = _interopRequireDefault(_is_js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// typeToTyp3
//amino type convert
exports.default = function (type) {
  if (_is_js2.default.boolean(type)) {
    return 0;
  }

  if (_is_js2.default.number(type)) {
    if (_is_js2.default.integer(type)) {
      return 0;
    } else {
      return 1;
    }
  }

  if (_is_js2.default.string(type) || _is_js2.default.array(type) || _is_js2.default.object(type)) {
    return 2;
  }
};

var size = exports.size = function size(items, iter, acc) {
  if (acc === undefined) acc = 0;
  for (var i = 0; i < items.length; ++i) {
    acc += iter(items[i], i, acc);
  }return acc;
};

var isAbstractCodec = exports.isAbstractCodec = function isAbstractCodec(codec) {
  return codec && typeof codec.encode === "function" && typeof codec.decode === "function" && typeof codec.encodingLength === "function";
};