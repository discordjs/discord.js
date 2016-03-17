'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('superagent'),
    Constants = require('../../util/Constants'),
    UserAgentManager = require('./UserAgentManager');

var ClientAPI = function () {
	function ClientAPI(client) {
		(0, _classCallCheck3.default)(this, ClientAPI);

		this.client = client;
		this.userAgentManager = new UserAgentManager(this);

		this.token = null;
	}

	(0, _createClass3.default)(ClientAPI, [{
		key: 'makeRequest',
		value: function makeRequest(method, url, auth, data, file) {
			var apiRequest = request[method](url);

			if (auth) {
				if (this.token) {
					apiRequest.set('authorization', this.token);
				} else {
					throw Constants.Errors.NO_TOKEN;
				}
			}

			if (data) {
				apiRequest.send(data);
			}

			if (file) {
				apiRequest.attach('file', file.file, file.name);
			}

			apiRequest.set('User-Agent', this.userAgent);

			return new _promise2.default(function (resolve, reject) {
				apiRequest.end(function (err, res) {
					if (err) {
						reject(err);
					} else {
						resolve(res.body);
					}
				});
			});
		}
	}, {
		key: 'getGateway',
		value: function getGateway() {
			var _this = this;

			return new _promise2.default(function (resolve, reject) {
				_this.makeRequest('get', Constants.Endpoints.GATEWAY, true).then(function (res) {
					return resolve(res.url);
				}).catch(reject);
			});
		}
	}, {
		key: 'login',
		value: function login(_login, password) {
			var _this2 = this;

			return new _promise2.default(function (resolve, reject) {
				if (!password) {
					return _this2.makeRequest('post', Constants.Endpoints.LOGIN, false, { token: _login }).then(function (data) {
						_this2.token = data.token;

						resolve(_this2.token);
					}).catch(reject);
				}

				_this2.makeRequest('post', Constants.Endpoints.LOGIN, false, { email: _login, password: password }).then(function (data) {
					_this2.token = data.token;

					resolve(_this2.token);
				}).catch(reject);
			});
		}
	}, {
		key: 'userAgent',
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
