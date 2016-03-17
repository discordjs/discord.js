'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Constants = require('../util/Constants'),
    ClientAPIManager = require('./API/ClientAPI'),
    ClientManager = require('./ClientManager'),
    ClientWebSocket = require('./WebSocket/ClientWebSocket'),
    ClientLogger = require('./ClientLogger'),
    ClientDataStore = require('./ClientDataStore'),
    EventEmitter = require('events').EventEmitter,
    MergeDefault = require('../util/MergeDefault');

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
		_this.store = new ClientDataStore(_this);
		_this.user = null;
		return _this;
	}

	/**
  * Returns the token received from the API authentication
  *
  * @returns {String} Returns the bot's token
  */


	(0, _createClass3.default)(Client, [{
		key: 'getServerById',


		/**
   * Fetches a server by the server identifier
   *
   * @returns {Server} Returns a Server
   */
		value: function getServerById(id) {
			return this.servers.find(function (server) {
				return server.id === id;
			});
		}

		/**
   * Fetches servers by their name
   *
   * @returns {Server[]} Returns an array of Servers
   */

	}, {
		key: 'getServersByName',
		value: function getServersByName(name) {
			return this.servers.filter(function (server) {
				return server.name === name;
			});
		}

		/**
   * Fetches a user by the user identifier
   *
   * @returns {ClientUser} Returns a User
   */

	}, {
		key: 'getUserById',
		value: function getUserById(id) {
			return this.users.find(function (user) {
				return user.id === id;
			});
		}

		/**
   * Fetches users by their name
   *
   * @returns {ClientUser[]} Returns an array of ClientUsers
   */

	}, {
		key: 'getUsersByName',
		value: function getUsersByName(name) {
			return this.users.filter(function (user) {
				return user.name === name;
			});
		}
	}, {
		key: 'login',
		value: function login(email, password) {
			var _this2 = this;

			return new _promise2.default(function (resolve, reject) {
				_this2.api.login(email, password).then(function (token) {
					return _this2.manager.registerTokenAndConnect(token).then(resolve).catch(reject);
				}).catch(reject);
			});
		}
	}, {
		key: 'token',
		get: function get() {
			return this.api.token;
		}

		/**
   * Returns all of the users inside the datastore
   *
   * @returns {ClientUser[]} Returns an array of User objects
   */

	}, {
		key: 'users',
		get: function get() {
			return this.store.users;
		}

		/**
   * Returns all of the servers inside the datastore
   *
   * @returns {Server[]} Returns an array of Server objects
   */

	}, {
		key: 'servers',
		get: function get() {
			return this.store.servers;
		}
	}]);
	return Client;
}(EventEmitter);

module.exports = Client;
