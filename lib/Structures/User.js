"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Constants = require("../util/Constants");
var DataStore = require("../util/DataStore");

var User = function () {
	function User(client, data) {
		(0, _classCallCheck3.default)(this, User);

		this.client = client;
		if (data) {
			this.setup(data);
		}
	}

	(0, _createClass3.default)(User, [{
		key: "setup",
		value: function setup(data) {
			this.username = data.username || this.username;
			this.id = data.id || this.id;
			this.discriminator = data.discriminator || this.discriminator;
			this.avatar = data.avatar || this.avatar;
		}
	}]);
	return User;
}();

module.exports = User;