"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This class is used to manage the state
 * of the client and manage the setup and
 * shutdown of it
 */

var Constants = require("../util/Constants");
var ClientWebSocket = require("./WebSocket/ClientWebSocket");
var TAG = "manager";

var ClientManager = function () {
	function ClientManager(client) {
		(0, _classCallCheck3.default)(this, ClientManager);

		this.client = client;
		this.state = Constants.ConnectionState.NOT_STARTED;
		this.gateway = null;
		this.intervals = {
			keepAlive: null,
			other: []
		};
	}

	(0, _createClass3.default)(ClientManager, [{
		key: "registerTokenAndConnect",
		value: function () {
			var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(token) {
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								return _context.abrupt("return", this.connectToWebSocket(this.client.api.token = token));

							case 1:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function registerTokenAndConnect(_x) {
				return ref.apply(this, arguments);
			}

			return registerTokenAndConnect;
		}()
	}, {
		key: "disconnectedFromWebSocket",
		value: function disconnectedFromWebSocket() {
			this.state = Constants.ConnectionState.DISCONNECTED;
			this.client.emit("disconnected");
			this.client.logger.log(TAG, "state now disconnected");
		}
	}, {
		key: "setStateConnected",
		value: function setStateConnected() {
			this.state = Constants.ConnectionState.CONNECTED;
			this.client.websocket._resolve(this.client.token);
			this.client.emit("connected");
			this.client.logger.log(TAG, "state now connected");
		}
	}, {
		key: "setupKeepAlive",
		value: function setupKeepAlive(interval) {
			var _this = this;

			this.intervals.keepAlive = setInterval(function () {
				_this.client.logger.log(TAG, "sent keep alive packet");
				if (_this.client.websocket) {
					_this.client.websocket.send({
						op: 1,
						d: Date.now()
					});
				} else {
					clearInterval(_this.intervals.keepAlive);
				}
			}, interval);
		}
	}, {
		key: "connectToWebSocket",
		value: function () {
			var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(token) {
				var _this2 = this;

				return _regenerator2.default.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								return _context3.abrupt("return", new _promise2.default(function () {
									var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
										return _regenerator2.default.wrap(function _callee2$(_context2) {
											while (1) {
												switch (_context2.prev = _context2.next) {
													case 0:
														if (_this2.client.api.token) {
															_context2.next = 2;
															break;
														}

														throw Constants.Errors.NO_TOKEN;

													case 2:
														if (!(_this2.state === Constants.ConnectionState.CONNECTED)) {
															_context2.next = 4;
															break;
														}

														throw Constants.Errors.ALREADY_CONNECTED;

													case 4:
														if (!(_this2.state === Constants.ConnectionState.CONNECTING)) {
															_context2.next = 6;
															break;
														}

														throw Constants.Errors.ALREADY_CONNECTING;

													case 6:

														_this2.state = Constants.ConnectionState.CONNECTING;

														_context2.prev = 7;

														_this2.client.logger.log(TAG, "finding gateway");
														_context2.next = 11;
														return _this2.client.api.getGateway();

													case 11:
														_this2.gateway = _context2.sent;

														_this2.client.logger.log(TAG, "connecting to gateway " + _this2.gateway);
														_this2.client.websocket = new ClientWebSocket(_this2.client, _this2.gateway, resolve, reject);
														_context2.next = 19;
														break;

													case 16:
														_context2.prev = 16;
														_context2.t0 = _context2["catch"](7);
														return _context2.abrupt("return", reject(_context2.t0));

													case 19:
													case "end":
														return _context2.stop();
												}
											}
										}, _callee2, _this2, [[7, 16]]);
									}));
									return function (_x3, _x4) {
										return ref.apply(this, arguments);
									};
								}()));

							case 1:
							case "end":
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function connectToWebSocket(_x2) {
				return ref.apply(this, arguments);
			}

			return connectToWebSocket;
		}()
	}]);
	return ClientManager;
}();

module.exports = ClientManager;