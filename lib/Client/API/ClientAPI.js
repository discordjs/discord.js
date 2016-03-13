"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require("superagent");
var Constants = require("../../util/Constants");
var UserAgentManager = require("./UserAgentManager");

var ClientAPI = function () {
	function ClientAPI(client) {
		(0, _classCallCheck3.default)(this, ClientAPI);

		this.client = client;
		this.userAgentManager = new UserAgentManager(this);

		this.token = null;
	}

	(0, _createClass3.default)(ClientAPI, [{
		key: "makeRequest",
		value: function () {
			var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(method, url, auth, data, file) {
				var apiRequest;
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								apiRequest = request[method](url);

								if (!auth) {
									_context.next = 7;
									break;
								}

								if (!this.token) {
									_context.next = 6;
									break;
								}

								apiRequest.set("authorization", this.token);
								_context.next = 7;
								break;

							case 6:
								throw Constants.Errors.NO_TOKEN;

							case 7:

								if (data) {
									apiRequest.send(data);
								}

								if (file) {
									apiRequest.attach("file", file.file, file.name);
								}

								apiRequest.set("User-Agent", this.userAgent);

								return _context.abrupt("return", new _promise2.default(function (resolve, reject) {
									apiRequest.end(function (err, res) {
										if (err) {
											reject(err);
										} else {
											resolve(res.body);
										}
									});
								}));

							case 11:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function makeRequest(_x, _x2, _x3, _x4, _x5) {
				return ref.apply(this, arguments);
			}

			return makeRequest;
		}()
	}, {
		key: "getGateway",
		value: function () {
			var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								return _context2.abrupt("return", this.makeRequest("get", Constants.Endpoints.GATEWAY, true).then(function (res) {
									return res.url;
								}));

							case 1:
							case "end":
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function getGateway() {
				return ref.apply(this, arguments);
			}

			return getGateway;
		}()
	}, {
		key: "login",
		value: function () {
			var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(email, password) {
				var _this = this;

				return _regenerator2.default.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								return _context3.abrupt("return", this.makeRequest("post", Constants.Endpoints.LOGIN, false, { email: email, password: password }).then(function (data) {
									return _this.token = data.token;
								}));

							case 1:
							case "end":
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function login(_x6, _x7) {
				return ref.apply(this, arguments);
			}

			return login;
		}()
	}, {
		key: "userAgent",
		get: function get() {
			return this.userAgentManager.full;
		},
		set: function set(info) {
			this.userAgentManager.set(info);
		}
	}]);
	return ClientAPI;
}();

module.exports = ClientAPI;