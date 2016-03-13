"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReadyHandler = require("./Handlers/Ready");
var TAG = "websocket";

var PacketManager = function () {
	function PacketManager(clientWS) {
		(0, _classCallCheck3.default)(this, PacketManager);

		this.clientWS = clientWS;
		this.handlers = {
			"READY": new ReadyHandler(this)
		};
	}

	(0, _createClass3.default)(PacketManager, [{
		key: "log",
		value: function log(message) {
			this.client.logger.log(TAG, message);
		}
	}, {
		key: "handle",
		value: function handle(packet) {
			if (this.handlers[packet.t]) {
				return this.handlers[packet.t].handle(packet);
			}
			return false;
		}
	}, {
		key: "client",
		get: function get() {
			return this.clientWS.client;
		}
	}]);
	return PacketManager;
}();

module.exports = PacketManager;