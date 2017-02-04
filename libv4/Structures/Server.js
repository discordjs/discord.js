"use strict";

/**
 * Types of region for a server, include: `us-west`, `us-east`, `us-south`, `us-central`, `singapore`, `london`, `sydney`, `amsterdam` and `frankfurt`
 * @typedef {(string)} region
 */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bucket = require("../Util/Bucket");

var _Bucket2 = _interopRequireDefault(_Bucket);

var _Equality2 = require("../Util/Equality");

var _Equality3 = _interopRequireDefault(_Equality2);

var _Constants = require("../Constants");

var _Cache = require("../Util/Cache");

var _Cache2 = _interopRequireDefault(_Cache);

var _User = require("./User");

var _User2 = _interopRequireDefault(_User);

var _TextChannel = require("./TextChannel");

var _TextChannel2 = _interopRequireDefault(_TextChannel);

var _VoiceChannel = require("./VoiceChannel");

var _VoiceChannel2 = _interopRequireDefault(_VoiceChannel);

var _Role = require("./Role");

var _Role2 = _interopRequireDefault(_Role);

var _Emoji = require("./Emoji");

var _Emoji2 = _interopRequireDefault(_Emoji);

var _ArgumentRegulariser = require("../Util/ArgumentRegulariser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var strictKeys = ["region", "ownerID", "name", "id", "icon", "afkTimeout", "afkChannelID"];

var Server = function (_Equality) {
	_inherits(Server, _Equality);

	function Server(data, client) {
		_classCallCheck(this, Server);

		var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this));

		_this.client = client;
		_this.id = data.id;

		if (data.owner_id) {
			// new server data
			client.internal.buckets["bot:msg:guild:" + _this.id] = new _Bucket2.default(5, 5000);
			client.internal.buckets["dmsg:" + _this.id] = new _Bucket2.default(5, 1000);
			client.internal.buckets["bdmsg:" + _this.id] = new _Bucket2.default(1, 1000);
			client.internal.buckets["guild_member:" + _this.id] = new _Bucket2.default(10, 10000);
			client.internal.buckets["guild_member_nick:" + _this.id] = new _Bucket2.default(1, 1000);
		}

		_this.region = data.region;
		_this.ownerID = data.owner_id || data.ownerID;
		_this.name = data.name;
		_this.members = new _Cache2.default();
		_this.channels = new _Cache2.default();
		_this.roles = new _Cache2.default();
		_this.emojis = new _Cache2.default();
		_this.icon = data.icon;
		_this.afkTimeout = data.afk_timeout;
		_this.afkChannelID = data.afk_channel_id || data.afkChannelID;
		_this.memberMap = data.memberMap || {};
		_this.memberCount = data.member_count || data.memberCount;
		_this.large = data.large || _this.memberCount > 250;

		if (data.roles instanceof _Cache2.default) {
			data.roles.forEach(function (role) {
				return _this.roles.add(role);
			});
		} else {
			data.roles.forEach(function (dataRole) {
				_this.roles.add(new _Role2.default(dataRole, _this, client));
			});
		}

		if (data.emojis instanceof _Cache2.default) {
			data.emojis.forEach(function (emoji) {
				return _this.emojis.add(emoji);
			});
		} else {
			data.emojis.forEach(function (dataEmoji) {
				_this.emojis.add(new _Emoji2.default(dataEmoji, _this));
			});
		}

		if (data.members instanceof _Cache2.default) {
			data.members.forEach(function (member) {
				return _this.members.add(member);
			});
		} else {
			data.members.forEach(function (dataUser) {
				_this.memberMap[dataUser.user.id] = {
					roles: dataUser.roles,
					mute: dataUser.mute,
					selfMute: dataUser.self_mute,
					deaf: dataUser.deaf,
					selfDeaf: dataUser.self_deaf,
					joinedAt: Date.parse(dataUser.joined_at),
					nick: dataUser.nick || null
				};
				_this.members.add(client.internal.users.add(new _User2.default(dataUser.user, client)));
			});
		}

		if (data.channels instanceof _Cache2.default) {
			data.channels.forEach(function (channel) {
				return _this.channels.add(channel);
			});
		} else {
			data.channels.forEach(function (dataChannel) {
				if (dataChannel.type === 0) {
					_this.channels.add(client.internal.channels.add(new _TextChannel2.default(dataChannel, client, _this)));
				} else {
					_this.channels.add(client.internal.channels.add(new _VoiceChannel2.default(dataChannel, client, _this)));
				}
			});
		}

		if (data.presences) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = data.presences[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var presence = _step.value;

					var user = client.internal.users.get("id", presence.user.id);
					if (user) {
						user.status = presence.status;
						user.game = presence.game;
					}
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
		}

		if (data.voice_states) {
			if (_this.client.options.bot) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = data.voice_states[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var voiceState = _step2.value;

						var _user = _this.members.get("id", voiceState.user_id);
						if (_user) {
							_this.memberMap[_user.id] = _this.memberMap[_user.id] || {};
							_this.memberMap[_user.id].mute = voiceState.mute || _this.memberMap[_user.id].mute;
							_this.memberMap[_user.id].selfMute = voiceState.self_mute === undefined ? _this.memberMap[_user.id].selfMute : voiceState.self_mute;
							_this.memberMap[_user.id].deaf = voiceState.deaf || _this.memberMap[_user.id].deaf;
							_this.memberMap[_user.id].selfDeaf = voiceState.self_deaf === undefined ? _this.memberMap[_user.id].selfDeaf : voiceState.self_deaf;
							var channel = _this.channels.get("id", voiceState.channel_id);
							if (channel) {
								_this.eventVoiceJoin(_user, channel);
							} else {
								_this.client.emit("warn", "channel doesn't exist even though READY expects them to");
							}
						} else {
							_this.client.emit("warn", "user doesn't exist even though READY expects them to");
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
			} else {
				_this.pendingVoiceStates = data.voice_states;
			}
		}
		return _this;
	}

	_createClass(Server, [{
		key: "toObject",
		value: function toObject() {
			var keys = ['id', 'name', 'region', 'ownerID', 'icon', 'afkTimeout', 'afkChannelID', 'large', 'memberCount'],
			    obj = {};

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var k = _step3.value;

					obj[k] = this[k];
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			obj.members = this.members.map(function (member) {
				return member.toObject();
			});
			obj.channels = this.channels.map(function (channel) {
				return channel.toObject();
			});
			obj.roles = this.roles.map(function (role) {
				return role.toObject();
			});
			obj.emojis = this.emojis.map(function (emoji) {
				return emoji.toObject();
			});

			return obj;
		}
	}, {
		key: "detailsOf",
		value: function detailsOf(user) {
			var _this2 = this;

			user = this.client.internal.resolver.resolveUser(user);
			if (user) {
				var result = this.memberMap[user.id] || {};
				if (result && result.roles) {
					result.roles = result.roles.map(function (pid) {
						return _this2.roles.get("id", pid) || pid;
					});
				}
				return result;
			} else {
				return {};
			}
		}
	}, {
		key: "detailsOfUser",
		value: function detailsOfUser(user) {
			return this.detailsOf(user);
		}
	}, {
		key: "detailsOfMember",
		value: function detailsOfMember(user) {
			return this.detailsOf(user);
		}
	}, {
		key: "details",
		value: function details(user) {
			return this.detailsOf(user);
		}
	}, {
		key: "rolesOfUser",
		value: function rolesOfUser(user) {
			return this.detailsOf(user).roles || [];
		}
	}, {
		key: "rolesOfMember",
		value: function rolesOfMember(member) {
			return this.rolesOfUser(member);
		}
	}, {
		key: "rolesOf",
		value: function rolesOf(user) {
			return this.rolesOfUser(user);
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.name;
		}
	}, {
		key: "eventVoiceJoin",
		value: function eventVoiceJoin(user, channel) {
			// removes from other speaking channels first
			var oldChannel = this.eventVoiceLeave(user);

			channel.members.add(user);
			user.voiceChannel = channel;

			if (oldChannel.id && channel.id !== oldChannel.id) {
				this.client.emit("voiceLeave", oldChannel, user);
				this.client.emit("voiceSwitch", oldChannel, channel, user);
			}

			this.client.emit("voiceJoin", channel, user);
		}
	}, {
		key: "eventVoiceStateUpdate",
		value: function eventVoiceStateUpdate(channel, user, data) {
			if (!user.voiceChannel || user.voiceChannel.id !== channel.id) {
				return this.eventVoiceJoin(user, channel);
			}
			if (!this.memberMap[user.id]) {
				this.memberMap[user.id] = {};
			}
			var oldState = {
				mute: this.memberMap[user.id].mute,
				selfMute: this.memberMap[user.id].self_mute,
				deaf: this.memberMap[user.id].deaf,
				selfDeaf: this.memberMap[user.id].self_deaf
			};
			this.memberMap[user.id].mute = data.mute;
			this.memberMap[user.id].selfMute = data.self_mute;
			this.memberMap[user.id].deaf = data.deaf;
			this.memberMap[user.id].selfDeaf = data.self_deaf;
			if (oldState.mute !== undefined && (oldState.mute != data.mute || oldState.self_mute != data.self_mute || oldState.deaf != data.deaf || oldState.self_deaf != data.self_deaf)) {
				this.client.emit("voiceStateUpdate", channel, user, oldState, this.memberMap[user.id]);
			} else {
				this.eventVoiceJoin(user, channel);
			}
		}
	}, {
		key: "eventVoiceLeave",
		value: function eventVoiceLeave(user) {
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.channels.getAll("type", 2)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var chan = _step4.value;

					if (chan.members.has("id", user.id)) {
						chan.members.remove(user);
						user.voiceChannel = null;
						return chan;
					}
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			return { server: this };
		}
	}, {
		key: "equalsStrict",
		value: function equalsStrict(obj) {
			if (obj instanceof Server) {
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = strictKeys[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var key = _step5.value;

						if (obj[key] !== this[key]) {
							return false;
						}
					}
				} catch (err) {
					_didIteratorError5 = true;
					_iteratorError5 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion5 && _iterator5.return) {
							_iterator5.return();
						}
					} finally {
						if (_didIteratorError5) {
							throw _iteratorError5;
						}
					}
				}
			} else {
				return false;
			}
			return true;
		}
	}, {
		key: "leave",
		value: function leave() {
			return this.client.leaveServer.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "delete",
		value: function _delete() {
			return this.client.leaveServer.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "createInvite",
		value: function createInvite() {
			return this.client.createInvite.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "createRole",
		value: function createRole() {
			return this.client.createRole.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "banMember",
		value: function banMember(user, tlength, callback) {
			return this.client.banMember.apply(this.client, [user, this, tlength, callback]);
		}
	}, {
		key: "banUser",
		value: function banUser(user, tlength, callback) {
			return this.client.banMember.apply(this.client, [user, this, tlength, callback]);
		}
	}, {
		key: "ban",
		value: function ban(user, tlength, callback) {
			return this.client.banMember.apply(this.client, [user, this, tlength, callback]);
		}
	}, {
		key: "unbanMember",
		value: function unbanMember(user, callback) {
			return this.client.unbanMember.apply(this.client, [user, this, callback]);
		}
	}, {
		key: "unbanUser",
		value: function unbanUser(user, callback) {
			return this.client.unbanMember.apply(this.client, [user, this, callback]);
		}
	}, {
		key: "unban",
		value: function unban(user, callback) {
			return this.client.unbanMember.apply(this.client, [user, this, callback]);
		}
	}, {
		key: "kickMember",
		value: function kickMember(user, callback) {
			return this.client.kickMember.apply(this.client, [user, this, callback]);
		}
	}, {
		key: "kickUser",
		value: function kickUser(user, callback) {
			return this.client.kickMember.apply(this.client, [user, this, callback]);
		}
	}, {
		key: "kick",
		value: function kick(user, callback) {
			return this.client.kickMember.apply(this.client, [user, this, callback]);
		}
	}, {
		key: "getBans",
		value: function getBans() {
			return this.client.getBans.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "createChannel",
		value: function createChannel() {
			return this.client.createChannel.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "setNickname",
		value: function setNickname() {
			return this.client.setNickname.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
		}
	}, {
		key: "membersWithRole",
		value: function membersWithRole(role) {
			return this.members.filter(function (m) {
				return m.hasRole(role);
			});
		}
	}, {
		key: "usersWithRole",
		value: function usersWithRole(role) {
			return this.membersWithRole(role);
		}
	}, {
		key: "webhooks",
		get: function get() {
			return this.channels.map(function (c) {
				return c.webhooks;
			}).reduce(function (previousChannel, currentChannel) {
				if (currentChannel) {
					currentChannel.forEach(function (webhook) {
						previousChannel.add(webhook);
					});
				}
				return previousChannel;
			}, new _Cache2.default("id"));
		}
	}, {
		key: "createdAt",
		get: function get() {
			return new Date(+this.id / 4194304 + 1420070400000);
		}
	}, {
		key: "iconURL",
		get: function get() {
			if (!this.icon) {
				return null;
			} else {
				return _Constants.Endpoints.SERVER_ICON(this.id, this.icon);
			}
		}
	}, {
		key: "afkChannel",
		get: function get() {
			return this.channels.get("id", this.afkChannelID);
		}
	}, {
		key: "defaultChannel",
		get: function get() {
			return this.channels.get("id", this.id);
		}
	}, {
		key: "generalChannel",
		get: function get() {
			return this.defaultChannel;
		}
	}, {
		key: "general",
		get: function get() {
			return this.defaultChannel;
		}
	}, {
		key: "owner",
		get: function get() {
			return this.members.get("id", this.ownerID);
		}
	}]);

	return Server;
}(_Equality3.default);

exports.default = Server;
//# sourceMappingURL=Server.js.map
