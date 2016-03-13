"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WebSocket = require("ws");
var Constants = require("../../util/Constants");
var zlib = require("zlib");
var PacketManager = require("./Packets/PacketManager");

var ClientWebSocket = function () {
	function ClientWebSocket(client, gateway, resolve, reject) {
		var _this = this;

		(0, _classCallCheck3.default)(this, ClientWebSocket);

		this.client = client;
		this.ws = new WebSocket(gateway);

		this._resolve = resolve;
		this._reject = reject;

		// arrow functions to keep scope
		this.ws.onerror = function (err) {
			return _this.eventError(err);
		};
		this.ws.onopen = function () {
			return _this.eventOpen();
		};
		this.ws.onclose = function () {
			return _this.eventClose();
		};
		this.ws.onmessage = function (e) {
			return _this.eventMessage(e);
		};

		this.packetManager = new PacketManager(this);
	}

	(0, _createClass3.default)(ClientWebSocket, [{
		key: "eventOpen",
		value: function eventOpen() {
			var data = this.client.options.ws;
			data.token = this.client.token;

			this.send({
				op: 2,
				d: data
			});
		}
	}, {
		key: "eventClose",
		value: function eventClose() {
			this._reject(Constants.Errors.WEBSOCKET_CLOSED_BEFORE_READY);
			this.client.manager.disconnectedFromWebSocket();
		}
	}, {
		key: "eventError",
		value: function eventError(err) {
			this._reject(err);
			this.client.emit("error", err);
			this.client.manager.disconnectedFromWebSocket();
		}
	}, {
		key: "eventMessage",
		value: function eventMessage(event) {
			var packet = void 0;
			try {
				if (event.binary) {
					event.data = zlib.inflateSync(event.data).toString();
				}
				packet = JSON.parse(event.data);
			} catch (e) {
				this.eventError(e);
				return;
			}
			this.packetManager.handle(packet);
		}
	}, {
		key: "send",
		value: function send(object) {
			if (this.ws.readyState === WebSocket.OPEN) {
				this.ws.send((0, _stringify2.default)(object));
				return true;
			} else {
				return false;
			}
		}
	}]);
	return ClientWebSocket;
}();

module.exports = ClientWebSocket;