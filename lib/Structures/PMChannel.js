"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Channel = require("./Channel");

var _Channel2 = _interopRequireDefault(_Channel);

var _User = require("./User");

var _User2 = _interopRequireDefault(_User);

var _Cache = require("../Util/Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PMChannel extends _Channel2.default {
	constructor(data, client) {
		super(data, client);

		this.type = data.type;
		this.lastMessageID = data.last_message_id || data.lastMessageID;
		this.messages = new _Cache2.default("id", client.options.maxCachedMessages);
		if (data.recipients instanceof _Cache2.default) {
			this.recipients = data.recipients;
		} else {
			this.recipients = new _Cache2.default();
			data.recipients.forEach(recipient => {
				this.recipients.add(this.client.internal.users.add(new _User2.default(recipient, this.client)));
			});
		}
		this.name = data.name !== undefined ? data.name : this.name;
		this.owner = data.owner || this.client.internal.users.get("id", data.owner_id);
		this.icon = data.icon !== undefined ? data.icon : this.icon;
	}

	get recipient() {
		return this.recipients[0];
	}

	/* warning! may return null */
	get lastMessage() {
		return this.messages.get("id", this.lastMessageID);
	}

	toString() {
		return this.recipient.toString();
	}

	toObject() {
		let keys = ['type', 'lastMessageID', 'recipient'],
		    obj = {};

		for (let k of keys) {
			obj[k] = this[k];
		}

		return obj;
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

	startTyping() {
		return this.client.startTyping.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	stopTyping() {
		return this.client.stopTyping.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	getLogs() {
		return this.client.getChannelLogs.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	getMessage() {
		return this.client.getMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}
}
exports.default = PMChannel;
//# sourceMappingURL=PMChannel.js.map
