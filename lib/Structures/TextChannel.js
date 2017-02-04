"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ServerChannel = require("./ServerChannel");

var _ServerChannel2 = _interopRequireDefault(_ServerChannel);

var _Cache = require("../Util/Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TextChannel extends _ServerChannel2.default {
	constructor(data, client, server) {
		super(data, client, server);

		this.topic = data.topic;
		this.lastMessageID = data.last_message_id || data.lastMessageID;
		this.webhooks = new _Cache2.default("id");
		this.messages = new _Cache2.default("id", client.options.maxCachedMessages);
	}

	/* warning! may return null */
	get lastMessage() {
		return this.messages.get("id", this.lastMessageID);
	}

	toObject() {
		let obj = super.toObject();

		obj.topic = this.topic;
		obj.lastMessageID = this.lastMessageID;

		return obj;
	}

	setTopic() {
		return this.client.setChannelTopic.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	sendMessage() {
		return this.client.sendMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	send() {
		return this.client.sendMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	sendTTSMessage() {
		return this.client.sendTTSMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	sendTTS() {
		return this.client.sendTTSMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	sendFile() {
		return this.client.sendFile.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	getLogs() {
		return this.client.getChannelLogs.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	getMessage() {
		return this.client.getMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	startTyping() {
		return this.client.startTyping.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	stopTyping() {
		return this.client.stopTyping.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}
}
exports.default = TextChannel;
//# sourceMappingURL=TextChannel.js.map
