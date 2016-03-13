"use strict";

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

var Generic = require("./Generic");

module.exports = function (_Generic) {
	(0, _inherits3.default)(ReadyHandler, _Generic);

	function ReadyHandler(manager) {
		(0, _classCallCheck3.default)(this, ReadyHandler);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ReadyHandler).call(this, manager));
	}

	(0, _createClass3.default)(ReadyHandler, [{
		key: "handle",
		value: function handle(packet) {
			var data = packet.d;
			this.manager.log("received READY packet");
			this.manager.client.manager.setupKeepAlive(data.heartbeat_interval);

			this.manager.client.manager.setStateConnected();
		}
	}]);
	return ReadyHandler;
}(Generic);