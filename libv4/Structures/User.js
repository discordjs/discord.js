"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Equality2 = require("../Util/Equality");

var _Equality3 = _interopRequireDefault(_Equality2);

var _Constants = require("../Constants");

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var User = function (_Equality) {
	_inherits(User, _Equality);

	function User(data, client) {
		_classCallCheck(this, User);

		var _this = _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).call(this));

		_this.client = client;
		_this.username = data.username;
		_this.discriminator = data.discriminator;
		_this.id = data.id;
		_this.avatar = data.avatar;
		_this.bot = !!data.bot;
		_this.status = data.status || "offline";
		_this.game = data.game || null;
		_this.typing = {
			since: null,
			channel: null
		};
		_this.note = data.note || null;
		_this.voiceChannel = null;
		_this.voiceState = {};
		_this.speaking = false;
		return _this;
	}

	_createClass(User, [{
		key: "mention",
		value: function mention() {
			return "<@" + this.id + ">";
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.mention();
		}
	}, {
		key: "toObject",
		value: function toObject() {
			var keys = ['id', 'username', 'discriminator', 'avatar', 'bot', 'status', 'game', 'note', 'voiceState', 'speaking'],
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

			obj.typing = {
				since: this.typing.since,
				channelID: this.typing.channel ? this.typing.channel.id : null
			};
			obj.voiceChannelID = this.voiceChannel ? this.voiceChannel.id : null;

			return obj;
		}
	}, {
		key: "equalsStrict",
		value: function equalsStrict(obj) {
			if (obj instanceof User) return this.id === obj.id && this.username === obj.username && this.discriminator === obj.discriminator && this.avatar === obj.avatar && this.status === obj.status && (this.game === obj.game || this.game && obj.game && this.game.name === obj.game.name);else return false;
		}
	}, {
		key: "equals",
		value: function equals(obj) {
			if (obj instanceof User) return this.id === obj.id && this.username === obj.username && this.discriminator === obj.discriminator && this.avatar === obj.avatar;else return false;
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
		key: "addTo",
		value: function addTo(role, callback) {
			return this.client.addMemberToRole.apply(this.client, [this, role, callback]);
		}
	}, {
		key: "removeFrom",
		value: function removeFrom(role, callback) {
			return this.client.removeMemberFromRole.apply(this.client, [this, role, callback]);
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
		key: "hasRole",
		value: function hasRole(role) {
			return this.client.memberHasRole.apply(this.client, [this, role]);
		}
	}, {
		key: "createdAt",
		get: function get() {
			return new Date(+this.id / 4194304 + 1420070400000);
		}
	}, {
		key: "avatarURL",
		get: function get() {
			if (!this.avatar) {
				return null;
			} else {
				return _Constants.Endpoints.AVATAR(this.id, this.avatar);
			}
		}
	}, {
		key: "name",
		get: function get() {
			return this.username;
		}
	}]);

	return User;
}(_Equality3.default);

exports.default = User;
//# sourceMappingURL=User.js.map
