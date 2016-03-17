'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var GenericHandler = require('./GenericHandler'),
    Server = require('../../../../Structures/Server'),
    ClientUser = require('../../../../Structures/ClientUser');

var ReadyHandler = function (_GenericHandler) {
	(0, _inherits3.default)(ReadyHandler, _GenericHandler);

	function ReadyHandler() {
		(0, _classCallCheck3.default)(this, ReadyHandler);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ReadyHandler).apply(this, arguments));
	}

	(0, _createClass3.default)(ReadyHandler, [{
		key: 'handle',
		value: function handle(packet) {
			var data = packet.d;

			this.manager.log('received READY packet');
			var startTime = Date.now();

			this.client.manager.setupKeepAlive(data.heartbeat_interval);

			this.client.user = this.client.store.add('users', new ClientUser(this.client, data.user));

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = (0, _getIterator3.default)(data.guilds), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var server = _step.value;

					var srv = this.client.store.add('servers', new Server(this.client, server));
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			this.client.manager.setStateConnected();
			this.manager.log('took ' + (Date.now() - startTime) + 'ms to parse READY');
			this.manager.log('connected with ' + this.client.users.length + ' users and ' + this.client.servers.length + ' servers');
		}
	}]);
	return ReadyHandler;
}(GenericHandler);

module.exports = ReadyHandler;
