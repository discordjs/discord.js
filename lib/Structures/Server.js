"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

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
var User = require("./User");

var ServerDataStore = function (_DataStore) {
	(0, _inherits3.default)(ServerDataStore, _DataStore);

	function ServerDataStore() {
		(0, _classCallCheck3.default)(this, ServerDataStore);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerDataStore).call(this));

		_this._members = [];
		_this._channels = [];
		return _this;
	}

	(0, _createClass3.default)(ServerDataStore, [{
		key: "members",
		get: function get() {
			return (0, _entries2.default)(this._members);
		}
	}, {
		key: "channels",
		get: function get() {
			return (0, _entries2.default)(this._channels);
		}
	}]);
	return ServerDataStore;
}(DataStore);

var Server = function () {
	function Server(client, data) {
		(0, _classCallCheck3.default)(this, Server);

		this.client = client;
		if (data) this.setup(data);
	}

	(0, _createClass3.default)(Server, [{
		key: "setup",
		value: function setup(data) {
			var client = this.client;
			if (data.hasOwnProperty("unavailable")) {
				this.available = !data.unavailable;
			} else {
				if (!this.hasOwnProperty("available")) {
					this.available = true;
				}
			}
			this.name = data.name || this.name;
			this.icon = data.icon || this.icon;
			this.region = data.region || this.region;
			this.afk_timeout = data.afk_timeout || this.afk_timeout;
			this.member_count = data.member_count || this.member_count;
			this.owner_id = data.owner_id || this.owner_id;
			this.id = data.id || this.id;
			this.joined_at = data.joined_at || this.joined_at;
			this.afk_channel_id = data.afk_channel_id || this.afk_channel_id;

			if (!this.store) this.store = new ServerDataStore();

			if (this.available) {
				if (data.members) {
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = (0, _getIterator3.default)(data.members), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var member = _step.value;

							this.store.add("members", client.store.add("users", new User(this.client, member.user)));
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
				}
			}
		}
	}, {
		key: "owner",
		get: function get() {
			return this.client.store.get("users", "id", this.owner_id);
		}
	}, {
		key: "members",
		get: function get() {
			return this.store.members;
		}
	}, {
		key: "channels",
		get: function get() {
			return this.store.channels;
		}
	}]);
	return Server;
}();

module.exports = Server;