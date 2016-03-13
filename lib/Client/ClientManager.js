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
var ClientWebSocket = require("./ClientWebSocket");

var ClientManager = function () {
	function ClientManager(client) {
		(0, _classCallCheck3.default)(this, ClientManager);

		this.client = client;
		this.state = Constants.ConnectionState.NOT_STARTED;
		this.gateway = null;
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
		value: function () {
			var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								this.state = Constants.ConnectionState.DISCONNECTED;

							case 1:
							case "end":
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function disconnectedFromWebSocket() {
				return ref.apply(this, arguments);
			}

			return disconnectedFromWebSocket;
		}()
	}, {
		key: "connectToWebSocket",
		value: function () {
			var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(token) {
				var _this = this;

				return _regenerator2.default.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								return _context4.abrupt("return", new _promise2.default(function () {
									var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve, reject) {
										return _regenerator2.default.wrap(function _callee3$(_context3) {
											while (1) {
												switch (_context3.prev = _context3.next) {
													case 0:
														if (_this.client.api.token) {
															_context3.next = 2;
															break;
														}

														throw Constants.Errors.NO_TOKEN;

													case 2:
														if (!(_this.state === Constants.ConnectionState.CONNECTED)) {
															_context3.next = 4;
															break;
														}

														throw Constants.Errors.ALREADY_CONNECTED;

													case 4:
														if (!(_this.state === Constants.ConnectionState.CONNECTING)) {
															_context3.next = 6;
															break;
														}

														throw Constants.Errors.ALREADY_CONNECTING;

													case 6:

														_this.state = Constants.ConnectionState.CONNECTING;

														_context3.prev = 7;
														_context3.next = 10;
														return _this.client.api.getGateway();

													case 10:
														_this.gateway = _context3.sent;

														_this.client.websocket = new ClientWebSocket(_this.client, _this.gateway, resolve, reject);
														_context3.next = 17;
														break;

													case 14:
														_context3.prev = 14;
														_context3.t0 = _context3["catch"](7);
														return _context3.abrupt("return", reject(_context3.t0));

													case 17:
													case "end":
														return _context3.stop();
												}
											}
										}, _callee3, _this, [[7, 14]]);
									}));
									return function (_x3, _x4) {
										return ref.apply(this, arguments);
									};
								}()));

							case 1:
							case "end":
								return _context4.stop();
						}
					}
				}, _callee4, this);
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