"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var Constants = require("../util/Constants");
var ClientAPIManager = require("./API/ClientAPI");
var ClientManager = require("./ClientManager");
var ClientWebSocket = require("./WebSocket/ClientWebSocket");
var ClientLogger = require("./ClientLogger");
var EventEmitter = require("events").EventEmitter;
var MergeDefault = require("../util/MergeDefault");

var Client = function (_EventEmitter) {
	(0, _inherits3.default)(Client, _EventEmitter);

	function Client(options) {
		(0, _classCallCheck3.default)(this, Client);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Client).call(this));

		_this.options = MergeDefault(Constants.DefaultOptions, options);
		_this.manager = new ClientManager(_this);
		_this.api = new ClientAPIManager(_this);
		_this.websocket = null;
		_this.logger = new ClientLogger(_this);
		return _this;
	}

	(0, _createClass3.default)(Client, [{
		key: "login",
		value: function () {
			var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(email, password) {
				var _this2 = this;

				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								return _context.abrupt("return", this.api.login(email, password).then(function (token) {
									return _this2.manager.registerTokenAndConnect(token);
								}));

							case 1:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function login(_x, _x2) {
				return ref.apply(this, arguments);
			}

			return login;
		}()
	}, {
		key: "token",
		get: function get() {
			return this.api.token;
		}
	}]);
	return Client;
}(EventEmitter);

module.exports = Client;