"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ServerChannel = require("./ServerChannel.js");
var Cache = require("../Util/Cache.js");
var reg = require("../Util/ArgumentRegulariser.js").reg;

var TextChannel = (function (_ServerChannel) {
	_inherits(TextChannel, _ServerChannel);

	function TextChannel(data, client, server) {
		_classCallCheck(this, TextChannel);

		_ServerChannel.call(this, data, client, server);

		this.topic = data.topic;
		this.lastMessageID = data.last_message_id;
		this.messages = new Cache("id", client.options.maximumMessages);
	}

	/* warning! may return null */

	TextChannel.prototype.setTopic = function setTopic() {
		return this.client.setTopic.apply(this.client, reg(this, arguments));
	};

	TextChannel.prototype.setNameAndTopic = function setNameAndTopic() {
		return this.client.setChannelNameAndTopic.apply(this.client, reg(this, arguments));
	};

	TextChannel.prototype.update = function update() {
		return this.client.updateChannel.apply(this.client, reg(this, arguments));
	};

	TextChannel.prototype.sendMessage = function sendMessage() {
		return this.client.sendMessage.apply(this.client, reg(this, arguments));
	};

	TextChannel.prototype.sendTTSMessage = function sendTTSMessage() {
		return this.client.sendTTSMessage.apply(this.client, reg(this, arguments));
	};

	_createClass(TextChannel, [{
		key: "lastMessage",
		get: function get() {
			return this.messages.get("id", this.lastMessageID);
		}
	}]);

	return TextChannel;
})(ServerChannel);

module.exports = TextChannel;