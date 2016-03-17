"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServerChannel = function () {
	function ServerChannel(client, server, data) {
		(0, _classCallCheck3.default)(this, ServerChannel);

		this.client = client;
		this.server = server;

		if (data) {
			this.setup(data);
		}
	}

	(0, _createClass3.default)(ServerChannel, [{
		key: "setup",
		value: function setup(data) {
			var client = this.client;

			this.id = data.id;
			this.name = data.name;
			this.type = data.type;
			this.position = data.position;
			this.permission_overwrites = data.permission_overwrites; // todo
		}
	}]);
	return ServerChannel;
}();

module.exports = ServerChannel;
