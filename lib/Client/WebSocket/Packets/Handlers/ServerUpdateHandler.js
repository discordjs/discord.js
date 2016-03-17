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
    CloneObject = require('../../../../util/CloneObject'),
    Server = require('../../../../Structures/Server');

var ServerUpdateHandler = function (_GenericHandler) {
	(0, _inherits3.default)(ServerUpdateHandler, _GenericHandler);

	function ServerUpdateHandler() {
		(0, _classCallCheck3.default)(this, ServerUpdateHandler);
		return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerUpdateHandler).apply(this, arguments));
	}

	(0, _createClass3.default)(ServerUpdateHandler, [{
		key: 'handle',
		value: function handle(packet) {
			var data = packet.d;

			var server = this.client.store.get('servers', 'id', data.id);
			if (server) {
				// create de-referenced server for old state
				var oldServer = CloneObject(server);

				server.setup(data);
				this.client.emit(Constants.Events.SERVER_UPDATE, oldServer, server);
			} else {
				// no record of server
				this.manager.log('server ' + data.id + ' updated but no record of server in client data stores');
			}
		}
	}]);
	return ServerUpdateHandler;
}(GenericHandler);

module.exports = ServerUpdateHandler;
