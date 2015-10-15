"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PMChannel = require("./PMChannel.js");

var Message = (function () {
	function Message(data, channel, mentions, author) {
		_classCallCheck(this, Message);

		this.tts = data.tts;
		this.timestamp = Date.parse(data.timestamp);
		this.nonce = data.nonce;
		this.mentions = mentions;
		this.everyoneMentioned = data.mention_everyone;
		this.id = data.id;
		this.embeds = data.embeds;
		this.editedTimestamp = data.edited_timestamp;
		this.content = data.content.trim();
		this.channel = channel;

		if (this.isPrivate) {
			this.author = this.channel.client.getUser("id", author.id);
		} else {
			this.author = this.channel.server.getMember("id", author.id) || this.channel.client.getUser("id", author.id);
		}

		this.attachments = data.attachments;
	}

	/*exports.Message.prototype.isPM = function() {
 	return ( this.channel instanceof PMChannel );
 }*/

	_createClass(Message, [{
		key: "isMentioned",
		value: function isMentioned(user) {
			var id = user.id ? user.id : user;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.mentions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var mention = _step.value;

					if (mention.id === id) {
						return true;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return false;
		}
	}, {
		key: "sender",
		get: function get() {
			return this.author;
		}
	}, {
		key: "isPrivate",
		get: function get() {
			return this.channel.isPrivate;
		}
	}]);

	return Message;
})();

module.exports = Message;