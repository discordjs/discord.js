"use strict";

/**
 * Options that can be applied to a message before sending it.
 * @typedef {(object)} MessageOptions
 * @property {boolean} [tts=false] Whether or not the message should be sent as text-to-speech.
*/

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Cache = require("../Util/Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _User = require("./User");

var _User2 = _interopRequireDefault(_User);

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

var _Equality = require("../Util/Equality");

var _Equality2 = _interopRequireDefault(_Equality);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Message extends _Equality2.default {
	constructor(data, channel, client) {
		super();
		this.type = data.type;
		this.channel = channel;
		this.server = channel.server;
		this.client = client;
		this.nonce = data.nonce;
		this.attachments = data.attachments;
		this.tts = data.tts;
		this.pinned = data.pinned;
		this.embeds = data.embeds;
		this.timestamp = Date.parse(data.timestamp);
		this.everyoneMentioned = data.mention_everyone !== undefined ? data.mention_everyone : data.everyoneMentioned;
		this.pinned = data.pinned;
		this.id = data.id;

		if (data.edited_timestamp) {
			this.editedTimestamp = Date.parse(data.edited_timestamp);
		}

		if (data.author instanceof _User2.default) {
			this.author = data.author;
		} else if (data.author) {
			this.author = client.internal.users.add(new _User2.default(data.author, client));
		}

		this.content = data.content;
		if (!this.type) {} else if (this.type === 1) {
			this.content = this.author.mention() + " added <@" + data.mentions[0].id + ">.";
		} else if (this.type === 2) {
			if (this.author.id === data.mentions[0].id) {
				this.content = this.author.mention() + " left the group.";
			} else {
				this.content = this.author.mention() + " removed <@" + data.mentions[0].id + ">.";
			}
		} else if (this.type === 3) {
			this.content = this.author.mention() + " started a call.";
		} else if (this.type === 4) {
			this.content = this.author.mention() + " changed the channel name: " + data.content;
		} else if (this.type === 5) {
			this.content = this.author.mention() + " changed the channel icon.";
		} else if (this.type === 6) {
			this.content = this.author.mention() + " pinned a message to this channel. See all the pins.";
		}

		var mentionData = client.internal.resolver.resolveMentions(data.content, channel);
		this.cleanContent = mentionData[1];
		this.mentions = [];

		mentionData[0].forEach(mention => {
			// this is .add and not .get because it allows the bot to cache
			// users from messages from logs who may have left the server and were
			// not previously cached.
			if (mention instanceof _User2.default) {
				this.mentions.push(mention);
			} else {
				this.mentions.push(client.internal.users.add(new _User2.default(mention, client)));
			}
		});
	}

	get sender() {
		return this.author;
	}

	toObject() {
		let keys = ['id', 'timestamp', 'everyoneMentioned', 'pinned', 'editedTimestamp', 'content', 'cleanContent', 'tts', 'attachments', 'embeds'],
		    obj = {};

		for (let k of keys) {
			obj[k] = this[k];
		}

		obj.channelID = this.channel ? this.channel.id : null;
		obj.serverID = this.server ? this.server.id : null;
		obj.author = this.author.toObject();
		obj.mentions = this.mentions.map(m => m.toObject());

		return obj;
	}

	isMentioned(user) {
		user = this.client.internal.resolver.resolveUser(user);
		if (!user) {
			return false;
		}
		for (var mention of this.mentions) {
			if (mention.id == user.id) {
				return true;
			}
		}
		return false;
	}

	toString() {
		return this.content;
	}

	delete() {
		return this.client.deleteMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	update() {
		return this.client.updateMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	edit() {
		return this.client.updateMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	reply() {
		return this.client.reply.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	replyTTS() {
		return this.client.replyTTS.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	pin() {
		return this.client.pinMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	unpin() {
		return this.client.unpinMessage.apply(this.client, req(this, arguments));
	}
}
exports.default = Message;
//# sourceMappingURL=Message.js.map
