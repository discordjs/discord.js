'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This class is used to manage the state
 * of the client and manage the setup and
 * shutdown of it
 */

var Constants = require('../util/Constants'),
    ClientWebSocket = require('./WebSocket/ClientWebSocket'),
    TAG = 'manager';

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
		key: 'registerTokenAndConnect',
		value: function registerTokenAndConnect(token) {
			var _this = this;

			return new _promise2.default(function (resolve, reject) {
				_this.client.api.token = token;

				_this.connectToWebSocket().then(resolve).catch(reject);
			});
		}
	}, {
		key: 'disconnectedFromWebSocket',
		value: function disconnectedFromWebSocket() {
			this.state = Constants.ConnectionState.DISCONNECTED;
			this.client.emit(Constants.Events.DISCONNECTED);
			this.client.logger.log(TAG, 'state now disconnected');
		}
	}, {
		key: 'setStateConnected',
		value: function setStateConnected() {
			this.state = Constants.ConnectionState.CONNECTED;
			this.client.websocket._resolve(this.client.token);
			this.client.emit(Constants.Events.CONNECTED);
			this.client.logger.log(TAG, 'state now connected');
		}
	}, {
		key: 'setupKeepAlive',
		value: function setupKeepAlive(interval) {
			var _this2 = this;

			this.intervals.keepAlive = setInterval(function () {
				_this2.client.logger.log(TAG, 'sent keep alive packet');
				if (_this2.client.websocket) {
					_this2.client.websocket.send({
						op: 1,
						d: Date.now()
					});
				} else {
					clearInterval(_this2.intervals.keepAlive);
				}
			}, interval);
		}
	}, {
		key: 'connectToWebSocket',
		value: function connectToWebSocket() {
			var _this3 = this;

			return new _promise2.default(function () {
				var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
					return _regenerator2.default.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									if (_this3.client.api.token) {
										_context.next = 2;
										break;
									}

									throw Constants.Errors.NO_TOKEN;

								case 2:
									if (!(_this3.state === Constants.ConnectionState.CONNECTED)) {
										_context.next = 4;
										break;
									}

									throw Constants.Errors.ALREADY_CONNECTED;

								case 4:
									if (!(_this3.state === Constants.ConnectionState.CONNECTING)) {
										_context.next = 6;
										break;
									}

									throw Constants.Errors.ALREADY_CONNECTING;

								case 6:

									_this3.state = Constants.ConnectionState.CONNECTING;

									_context.prev = 7;

									_this3.client.logger.log(TAG, 'finding gateway');
									_context.next = 11;
									return _this3.client.api.getGateway();

								case 11:
									_this3.gateway = _context.sent;

									_this3.client.logger.log(TAG, 'connecting to gateway ' + _this3.gateway);
									_this3.client.websocket = new ClientWebSocket(_this3.client, _this3.gateway, resolve, reject);
									_context.next = 19;
									break;

								case 16:
									_context.prev = 16;
									_context.t0 = _context['catch'](7);
									return _context.abrupt('return', reject(_context.t0));

								case 19:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, _this3, [[7, 16]]);
				}));
				return function (_x, _x2) {
					return ref.apply(this, arguments);
				};
			}());
		}
	}]);
	return ClientManager;
}();

module.exports = ClientManager;
