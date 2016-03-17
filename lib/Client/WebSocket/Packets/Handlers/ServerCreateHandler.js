'use strict';

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
    Constants = require('../../../../util/Constants'),
    Server = require('../../../../Structures/Server');

var ServerCreateHandler = function (_GenericHandler) {
	(0, _inherits3.default)(ServerCreateHandler, _GenericHandler);

	function ServerCreateHandler() {
		(0, _classCallCheck3.default)(this, ServerCreateHandler);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerCreateHandler).apply(this, arguments));
	}

	(0, _createClass3.default)(ServerCreateHandler, [{
		key: 'handle',
		value: function handle(packet) {
			var data = packet.d;

			/*	server will only exist if the user has created it or if
    it was unavailable */
			var server = this.client.store.get('servers', 'id', data.id);
			if (server) {
				if (!server.available && !data.unavailable) {
					// server is now available again
					server.setup(data);
					this.client.emit(Constants.Events.SERVER_AVAILABLE, server);
				}
			} else {
				// new server
				server = this.client.store.add('servers', new Server(client, data));
				this.client.emit(Constants.Events.SERVER_CREATE, server);
			}
		}
	}]);
	return ServerCreateHandler;
}(GenericHandler);

module.exports = ServerCreateHandler;
