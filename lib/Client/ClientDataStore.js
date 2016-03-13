"use strict";

var _entries = require("babel-runtime/core-js/object/entries");

var _entries2 = _interopRequireDefault(_entries);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Constants = require("../util/Constants");
var DataStore = require("../util/DataStore");

var ClientDataStore = function (_DataStore) {
	(0, _inherits3.default)(ClientDataStore, _DataStore);

	function ClientDataStore(client) {
		(0, _classCallCheck3.default)(this, ClientDataStore);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientDataStore).call(this));

		_this.client = client;
		_this._users = {};
		_this._servers = {};
		return _this;
	}

	(0, _createClass3.default)(ClientDataStore, [{
		key: "users",
		get: function get() {
			return (0, _entries2.default)(this._users);
		}
	}, {
		key: "servers",
		get: function get() {
			return (0, _entries2.default)(this._servers);
		}
	}]);
	return ClientDataStore;
}(DataStore);

module.exports = ClientDataStore;