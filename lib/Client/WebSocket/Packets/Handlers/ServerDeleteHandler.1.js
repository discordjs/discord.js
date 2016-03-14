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

var GenericHandler = require("./GenericHandler");
var Constants = require("../../../../util/Constants");
var Server = require("../../../../Structures/Server");

module.exports = function (_GenericHandler) {
	(0, _inherits3.default)(ServerDeleteHandler, _GenericHandler);

	function ServerDeleteHandler(manager) {
		(0, _classCallCheck3.default)(this, ServerDeleteHandler);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerDeleteHandler).call(this, manager));
	}

	(0, _createClass3.default)(ServerDeleteHandler, [{
		key: "handle",
		value: function handle(packet) {
			var data = packet.d;
			var client = this.manager.client;

			var server = client.store.get("servers", "id", data.id);
			if (server) {
				if (data.unavailable) {
					// server has become unavailable
					server.available = false;
					client.emit(Constants.Events.SERVER_UNAVAILABLE, server);
				} else {
					// server was deleted
					client.store.remove("servers", server);
					client.emit(Constants.Events.SERVER_DELETE, server);
				}
			} else {
				// no record of server
				this.manager.log("server " + data.id + " deleted but no record of server in client data stores");
			}
		}
	}]);
	return ServerDeleteHandler;
}(GenericHandler);