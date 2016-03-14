"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Constants = require("../util/Constants");
var ServerChannel = require("./ServerChannel");
var User = require("./User");

var TextChannel = function (_ServerChannel) {
	(0, _inherits3.default)(TextChannel, _ServerChannel);

	function TextChannel(client, server, data) {
		(0, _classCallCheck3.default)(this, TextChannel);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TextChannel).call(this, client, server, data));

		if (data) _this.setup(data);
		return _this;
	}

	(0, _createClass3.default)(TextChannel, [{
		key: "setup",
		value: function setup(data) {
			(0, _get3.default)((0, _getPrototypeOf2.default)(TextChannel.prototype), "setup", this).call(this, data);
			var client = this.client;
			this.topic = data.topic;
			this.last_message_id = data.last_message_id;
		}
	}]);
	return TextChannel;
}(ServerChannel);

module.exports = TextChannel;