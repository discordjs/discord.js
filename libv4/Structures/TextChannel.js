"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ServerChannel2 = require("./ServerChannel");

var _ServerChannel3 = _interopRequireDefault(_ServerChannel2);

var _Cache = require("../Util/Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextChannel = function (_ServerChannel) {
	_inherits(TextChannel, _ServerChannel);

	function TextChannel(data, client, server) {
		_classCallCheck(this, TextChannel);

		var _this = _possibleConstructorReturn(this, (TextChannel.__proto__ || Object.getPrototypeOf(TextChannel)).call(this, data, client, server));

		_this.topic = data.topic;
		_this.lastMessageID = data.last_message_id || data.lastMessageID;
		_this.webhooks = new _Cache2.default("id");
		_this.messages = new _Cache2.default("id", client.options.maxCachedMessages);
		return _this;
	}

	/* warning! may return null */


	_createClass(TextChannel, [{
		key: "toObject",
		value: function toObject() {
			var obj = _get(TextChannel.prototype.__proto__ || Object.getPrototypeOf(TextChannel.prototype), "toObject", this).call(this);

			obj.topic = this.topic;
			obj.lastMessageID = this.lastMessageID;

			return obj;
		}
	}, {
		key: "setTopic",
		value: function setTopic() {
			return this.client.setChannelTopic.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "sendMessage",
		value: function sendMessage() {
			return this.client.sendMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "send",
		value: function send() {
			return this.client.sendMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "sendTTSMessage",
		value: function sendTTSMessage() {
			return this.client.sendTTSMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "sendTTS",
		value: function sendTTS() {
			return this.client.sendTTSMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "sendFile",
		value: function sendFile() {
			return this.client.sendFile.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "getLogs",
		value: function getLogs() {
			return this.client.getChannelLogs.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "getMessage",
		value: function getMessage() {
			return this.client.getMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "startTyping",
		value: function startTyping() {
			return this.client.startTyping.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "stopTyping",
		value: function stopTyping() {
			return this.client.stopTyping.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "lastMessage",
		get: function get() {
			return this.messages.get("id", this.lastMessageID);
		}
	}]);

	return TextChannel;
}(_ServerChannel3.default);

exports.default = TextChannel;
//# sourceMappingURL=TextChannel.js.map
