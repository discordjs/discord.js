"use strict";

var _entries = require("babel-runtime/core-js/object/entries");

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Constants = require("./Constants");

var DataStore = function () {
	function DataStore() {
		(0, _classCallCheck3.default)(this, DataStore);
	}

	(0, _createClass3.default)(DataStore, [{
		key: "has",
		value: function has(where, object) {
			where = "_" + where;
			if (typeof object === "string" || object instanceof String) {
				return this[where][object];
			} else {
				return this[where][object.id];
			}
		}
	}, {
		key: "get",
		value: function get(where, key, value) {
			where = "_" + where;
			if (key === "id") {
				return this[where][value];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = (0, _getIterator3.default)((0, _entries2.default)(this[where])), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var item = _step.value;

					if (item[key] === value) {
						return item[key];
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return null;
		}
	}, {
		key: "add",
		value: function add(where, object) {
			where = "_" + where;
			if (this[where][object.id]) {
				return this[where][object.id];
			} else {
				return this[where][object.id] = object;
			}
		}
	}]);
	return DataStore;
}();

module.exports = DataStore;