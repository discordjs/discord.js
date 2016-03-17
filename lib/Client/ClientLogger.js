'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Constants = require('../util/Constants');

var ClientLogger = function () {
	function ClientLogger(client) {
		(0, _classCallCheck3.default)(this, ClientLogger);

		this.client = client;
	}

	(0, _createClass3.default)(ClientLogger, [{
		key: 'log',
		value: function log(tag, message) {
			if (this.client.options.logging.enabled) {
				console.log('[LOG ' + time() + '] ' + tag + ' >> ' + message);
			}

			if (this.client.options.logging.as_event) {
				this.client.emit(Constants.Events.LOG, tag, message);
			}
		}
	}]);
	return ClientLogger;
}();

function prettify(n) {
	return n < 10 ? '0' + n : n;
}

function time() {
	var now = new Date();
	var h = prettify(now.getHours());
	var m = prettify(now.getMinutes());
	var s = prettify(now.getSeconds());
	return h + ':' + m + ':' + s;
}

module.exports = ClientLogger;
