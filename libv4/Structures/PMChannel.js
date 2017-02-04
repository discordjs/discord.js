"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Channel2 = require("./Channel");

var _Channel3 = _interopRequireDefault(_Channel2);

var _User = require("./User");

var _User2 = _interopRequireDefault(_User);

var _Cache = require("../Util/Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PMChannel = function (_Channel) {
	_inherits(PMChannel, _Channel);

	function PMChannel(data, client) {
		_classCallCheck(this, PMChannel);

		var _this = _possibleConstructorReturn(this, (PMChannel.__proto__ || Object.getPrototypeOf(PMChannel)).call(this, data, client));

		_this.type = data.type;
		_this.lastMessageID = data.last_message_id || data.lastMessageID;
		_this.messages = new _Cache2.default("id", client.options.maxCachedMessages);
		if (data.recipients instanceof _Cache2.default) {
			_this.recipients = data.recipients;
		} else {
			_this.recipients = new _Cache2.default();
			data.recipients.forEach(function (recipient) {
				_this.recipients.add(_this.client.internal.users.add(new _User2.default(recipient, _this.client)));
			});
		}
		_this.name = data.name !== undefined ? data.name : _this.name;
		_this.owner = data.owner || _this.client.internal.users.get("id", data.owner_id);
		_this.icon = data.icon !== undefined ? data.icon : _this.icon;
		return _this;
	}

	_createClass(PMChannel, [{
		key: "toString",
		value: function toString() {
			return this.recipient.toString();
		}
	}, {
		key: "toObject",
		value: function toObject() {
			var keys = ['type', 'lastMessageID', 'recipient'],
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

			return obj;
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
		key: "recipient",
		get: function get() {
			return this.recipients[0];
		}

		/* warning! may return null */

	}, {
		key: "lastMessage",
		get: function get() {
			return this.messages.get("id", this.lastMessageID);
		}
	}]);

	return PMChannel;
}(_Channel3.default);

exports.default = PMChannel;
//# sourceMappingURL=PMChannel.js.map
