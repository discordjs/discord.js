"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cache = require("../Util/Cache.js");
var User = require("./User.js");
var reg = require("../Util/ArgumentRegulariser.js").reg;
var Equality = require("../Util/Equality");

var Message = (function (_Equality) {
	_inherits(Message, _Equality);

	function Message(data, channel, client) {
		var _this = this;

		_classCallCheck(this, Message);

		_Equality.call(this);
		this.channel = channel;
		this.client = client;
		this.nonce = data.nonce;
		this.attachments = data.attachments;
		this.tts = data.tts;
		this.embeds = data.embeds;
		this.timestamp = Date.parse(data.timestamp);
		this.everyoneMentioned = data.mention_everyone;
		this.id = data.id;

		if (data.edited_timestamp) this.editedTimestamp = Date.parse(data.edited_timestamp);

		if (data.author instanceof User) this.author = data.author;else this.author = client.internal.users.add(new User(data.author, client));

		this.content = data.content;
		this.mentions = new Cache();

		data.mentions.forEach(function (mention) {
			// this is .add and not .get because it allows the bot to cache
			// users from messages from logs who may have left the server and were
			// not previously cached.
			if (mention instanceof User) _this.mentions.push(mention);else _this.mentions.add(client.internal.users.add(new User(mention, client)));
		});
	}

	Message.prototype.isMentioned = function isMentioned(user) {
		user = this.client.internal.resolver.resolveUser(user);
		if (user) {
			return this.mentions.has("id", user.id);
		} else {
			return false;
		}
	};

	Message.prototype.toString = function toString() {
		return this.content;
	};

	Message.prototype["delete"] = function _delete() {
		return this.client.deleteMessage.apply(this.client, reg(this, arguments));
	};

	Message.prototype.update = function update() {
		return this.client.updateMessage.apply(this.client, reg(this, arguments));
	};

	Message.prototype.reply = function reply() {
		return this.client.reply.apply(this.client, reg(this, arguments));
	};

	Message.prototype.replyTTS = function replyTTS() {
		return this.client.replyTTS.apply(this.client, reg(this, arguments));
	};

	_createClass(Message, [{
		key: "sender",
		get: function get() {
			return this.author;
		}
	}]);

	return Message;
})(Equality);

module.exports = Message;