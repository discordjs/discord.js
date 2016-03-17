'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Constants = require('../../util/Constants');

var UserAgentManager = function () {
	function UserAgentManager(clientAPI) {
		(0, _classCallCheck3.default)(this, UserAgentManager);

		this.clientAPI = clientAPI;
		this._userAgent = {
			url: 'https://github.com/hydrabolt/discord.js',
			version: Constants.Package.version
		};
	}

	(0, _createClass3.default)(UserAgentManager, [{
		key: 'set',
		value: function set(info) {
			this._userAgent.url = info.url || 'https://github.com/hydrabolt/discord.js';
			this._userAgent.version = info.version || Constants.Package.version;
		}
	}, {
		key: 'full',
		get: function get() {
			return 'DiscordBot (' + this._userAgent.url + ', ' + this._userAgent.version + ')';
		}
	}]);
	return UserAgentManager;
}();

module.exports = UserAgentManager;
