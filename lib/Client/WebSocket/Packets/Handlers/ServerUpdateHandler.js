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
var CloneObject = require("../../../../util/CloneObject");
var Server = require("../../../../Structures/Server");

module.exports = function (_GenericHandler) {
	(0, _inherits3.default)(ServerUpdateHandler, _GenericHandler);

	function ServerUpdateHandler(manager) {
		(0, _classCallCheck3.default)(this, ServerUpdateHandler);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerUpdateHandler).call(this, manager));
	}

	(0, _createClass3.default)(ServerUpdateHandler, [{
		key: "handle",
		value: function handle(packet) {
			var data = packet.d;
			var client = this.manager.client;

			var server = client.store.get("servers", "id", data.id);
			if (server) {
				// create dereferenced server for old state
				var old_server = CloneObject(server);

				server.setup(data);
				client.emit(Constants.Events.SERVER_UPDATE, old_server, server);
			} else {
				// no record of server
				this.manager.log("server " + data.id + " updated but no record of server in client data stores");
			}
		}
	}]);
	return ServerUpdateHandler;
}(GenericHandler);