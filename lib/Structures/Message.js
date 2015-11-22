"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cache = require("../Util/Cache.js");
var User = require("./User.js");
var reg = require("../Util/ArgumentRegulariser.js").reg;
var Equality = require("../Util/Equality");

var Message = (function (_Equality) {
	_inherits(Message, _Equality);

	function Message(data, channel, client) {
		_classCallCheck(this, Message);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Message).call(this));

		_this.channel = channel;
		_this.client = client;
		_this.nonce = data.nonce;
		_this.attachments = data.attachments;
		_this.tts = data.tts;
		_this.embeds = data.embeds;
		_this.timestamp = Date.parse(data.timestamp);
		_this.everyoneMentioned = data.mention_everyone;
		_this.id = data.id;

		if (data.edited_timestamp) _this.editedTimestamp = Date.parse(data.edited_timestamp);

		if (data.author instanceof User) _this.author = data.author;else _this.author = client.internal.users.add(new User(data.author, client));

		_this.content = data.content;
		_this.mentions = new Cache();

		data.mentions.forEach(function (mention) {
			// this is .add and not .get because it allows the bot to cache
			// users from messages from logs who may have left the server and were
			// not previously cached.
			if (mention instanceof User) _this.mentions.push(mention);else _this.mentions.add(client.internal.users.add(new User(mention, client)));
		});
		return _this;
	}

	_createClass(Message, [{
		key: "isMentioned",
		value: function isMentioned(user) {
			user = this.client.internal.resolver.resolveUser(user);
			if (user) {
				return this.mentions.has("id", user.id);
			} else {
				return false;
			}
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.content;
		}
	}, {
		key: "delete",
		value: function _delete() {
			return this.client.deleteMessage.apply(this.client, reg(this, arguments));
		}
	}, {
		key: "update",
		value: function update() {
			return this.client.updateMessage.apply(this.client, reg(this, arguments));
		}
	}, {
		key: "reply",
		value: function reply() {
			return this.client.reply.apply(this.client, reg(this, arguments));
		}
	}, {
		key: "replyTTS",
		value: function replyTTS() {
			return this.client.replyTTS.apply(this.client, reg(this, arguments));
		}
	}, {
		key: "sender",
		get: function get() {
			return this.author;
		}
	}]);

	return Message;
})(Equality);

module.exports = Message;