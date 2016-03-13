"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require("superagent");
var Constants = require("../util/Constants");

var ClientAPI = function () {
	function ClientAPI(client) {
		(0, _classCallCheck3.default)(this, ClientAPI);

		this.client = client;

		this.userAgent = {
			url: "https://github.com/hydrabolt/discord.js",
			version: Constants.Package.version
		};
	}

	(0, _createClass3.default)(ClientAPI, [{
		key: "makeRequest",
		value: function makeRequest(method, url, auth, data, file) {
			var apiRequest = request[method](url);
			apiRequest.set("User-Agent", this.userAgent);
		}
	}, {
		key: "userAgentInfo",
		get: function get() {
			return "DiscordBot (" + this.userAgent.url + ", " + this.userAgentInfo.version + ")";
		},
		set: function set(info) {
			this.userAgent.url = info.url || "https://github.com/hydrabolt/discord.js";
			this.userAgent.version = info.version || Constants.Package.version;
		}
	}]);
	return ClientAPI;
}();

module.exports = ClientAPI;