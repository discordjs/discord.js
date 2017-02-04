"use strict";

/**
 * Options that can be applied to a message before sending it.
 * @typedef {(object)} MessageOptions
 * @property {boolean} [tts=false] Whether or not the message should be sent as text-to-speech.
*/

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cache = require("../Util/Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _User = require("./User");

var _User2 = _interopRequireDefault(_User);

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

var _Equality2 = require("../Util/Equality");

var _Equality3 = _interopRequireDefault(_Equality2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = function (_Equality) {
	_inherits(Message, _Equality);

	function Message(data, channel, client) {
		_classCallCheck(this, Message);

		var _this = _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).call(this));

		_this.type = data.type;
		_this.channel = channel;
		_this.server = channel.server;
		_this.client = client;
		_this.nonce = data.nonce;
		_this.attachments = data.attachments;
		_this.tts = data.tts;
		_this.pinned = data.pinned;
		_this.embeds = data.embeds;
		_this.timestamp = Date.parse(data.timestamp);
		_this.everyoneMentioned = data.mention_everyone !== undefined ? data.mention_everyone : data.everyoneMentioned;
		_this.pinned = data.pinned;
		_this.id = data.id;

		if (data.edited_timestamp) {
			_this.editedTimestamp = Date.parse(data.edited_timestamp);
		}

		if (data.author instanceof _User2.default) {
			_this.author = data.author;
		} else if (data.author) {
			_this.author = client.internal.users.add(new _User2.default(data.author, client));
		}

		_this.content = data.content;
		if (!_this.type) {} else if (_this.type === 1) {
			_this.content = _this.author.mention() + " added <@" + data.mentions[0].id + ">.";
		} else if (_this.type === 2) {
			if (_this.author.id === data.mentions[0].id) {
				_this.content = _this.author.mention() + " left the group.";
			} else {
				_this.content = _this.author.mention() + " removed <@" + data.mentions[0].id + ">.";
			}
		} else if (_this.type === 3) {
			_this.content = _this.author.mention() + " started a call.";
		} else if (_this.type === 4) {
			_this.content = _this.author.mention() + " changed the channel name: " + data.content;
		} else if (_this.type === 5) {
			_this.content = _this.author.mention() + " changed the channel icon.";
		} else if (_this.type === 6) {
			_this.content = _this.author.mention() + " pinned a message to this channel. See all the pins.";
		}

		var mentionData = client.internal.resolver.resolveMentions(data.content, channel);
		_this.cleanContent = mentionData[1];
		_this.mentions = [];

		mentionData[0].forEach(function (mention) {
			// this is .add and not .get because it allows the bot to cache
			// users from messages from logs who may have left the server and were
			// not previously cached.
			if (mention instanceof _User2.default) {
				_this.mentions.push(mention);
			} else {
				_this.mentions.push(client.internal.users.add(new _User2.default(mention, client)));
			}
		});
		return _this;
	}

	_createClass(Message, [{
		key: "toObject",
		value: function toObject() {
			var keys = ['id', 'timestamp', 'everyoneMentioned', 'pinned', 'editedTimestamp', 'content', 'cleanContent', 'tts', 'attachments', 'embeds'],
			    obj = {};

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var k = _step.value;

					obj[k] = this[k];
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			obj.channelID = this.channel ? this.channel.id : null;
			obj.serverID = this.server ? this.server.id : null;
			obj.author = this.author.toObject();
			obj.mentions = this.mentions.map(function (m) {
				return m.toObject();
			});

			return obj;
		}
	}, {
		key: "isMentioned",
		value: function isMentioned(user) {
			user = this.client.internal.resolver.resolveUser(user);
			if (!user) {
				return false;
			}
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.mentions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var mention = _step2.value;

					if (mention.id == user.id) {
						return true;
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return false;
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.content;
		}
	}, {
		key: "delete",
		value: function _delete() {
			return this.client.deleteMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "update",
		value: function update() {
			return this.client.updateMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "edit",
		value: function edit() {
			return this.client.updateMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "reply",
		value: function reply() {
			return this.client.reply.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "replyTTS",
		value: function replyTTS() {
			return this.client.replyTTS.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "pin",
		value: function pin() {
			return this.client.pinMessage.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "unpin",
		value: function unpin() {
			return this.client.unpinMessage.apply(this.client, req(this, arguments));
		}
	}, {
		key: "sender",
		get: function get() {
			return this.author;
		}
	}]);

	return Message;
}(_Equality3.default);

exports.default = Message;
//# sourceMappingURL=Message.js.map
