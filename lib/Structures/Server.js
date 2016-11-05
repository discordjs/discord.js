"use strict";

/**
 * Types of region for a server, include: `us-west`, `us-east`, `us-south`, `us-central`, `singapore`, `london`, `sydney`, `amsterdam` and `frankfurt`
 * @typedef {(string)} region
 */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Bucket = require("../Util/Bucket");

var _Bucket2 = _interopRequireDefault(_Bucket);

var _Equality = require("../Util/Equality");

var _Equality2 = _interopRequireDefault(_Equality);

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

var strictKeys = ["region", "ownerID", "name", "id", "icon", "afkTimeout", "afkChannelID"];

class Server extends _Equality2.default {

	constructor(data, client) {

		super();

		this.client = client;
		this.id = data.id;

		if (data.owner_id) {
			// new server data
			client.internal.buckets["bot:msg:guild:" + this.id] = new _Bucket2.default(5, 5000);
			client.internal.buckets["dmsg:" + this.id] = new _Bucket2.default(5, 1000);
			client.internal.buckets["bdmsg:" + this.id] = new _Bucket2.default(1, 1000);
			client.internal.buckets["guild_member:" + this.id] = new _Bucket2.default(10, 10000);
			client.internal.buckets["guild_member_nick:" + this.id] = new _Bucket2.default(1, 1000);
		}

		this.region = data.region;
		this.ownerID = data.owner_id || data.ownerID;
		this.name = data.name;
		this.members = new _Cache2.default();
		this.channels = new _Cache2.default();
		this.roles = new _Cache2.default();
		this.emojis = new _Cache2.default();
		this.icon = data.icon;
		this.afkTimeout = data.afk_timeout;
		this.afkChannelID = data.afk_channel_id || data.afkChannelID;
		this.memberMap = data.memberMap || {};
		this.memberCount = data.member_count || data.memberCount;
		this.large = data.large || this.memberCount > 250;

		if (data.roles instanceof _Cache2.default) {
			data.roles.forEach(role => this.roles.add(role));
		} else {
			data.roles.forEach(dataRole => {
				this.roles.add(new _Role2.default(dataRole, this, client));
			});
		}

		if (data.emojis instanceof _Cache2.default) {
			data.emojis.forEach(emoji => this.emojis.add(emoji));
		} else {
			data.emojis.forEach(dataEmoji => {
				this.emojis.add(new _Emoji2.default(dataEmoji, this));
			});
		}

		if (data.members instanceof _Cache2.default) {
			data.members.forEach(member => this.members.add(member));
		} else {
			data.members.forEach(dataUser => {
				this.memberMap[dataUser.user.id] = {
					roles: dataUser.roles,
					mute: dataUser.mute,
					selfMute: dataUser.self_mute,
					deaf: dataUser.deaf,
					selfDeaf: dataUser.self_deaf,
					joinedAt: Date.parse(dataUser.joined_at),
					nick: dataUser.nick || null
				};
				this.members.add(client.internal.users.add(new _User2.default(dataUser.user, client)));
			});
		}

		if (data.channels instanceof _Cache2.default) {
			data.channels.forEach(channel => this.channels.add(channel));
		} else {
			data.channels.forEach(dataChannel => {
				if (dataChannel.type === 0) {
					this.channels.add(client.internal.channels.add(new _TextChannel2.default(dataChannel, client, this)));
				} else {
					this.channels.add(client.internal.channels.add(new _VoiceChannel2.default(dataChannel, client, this)));
				}
			});
		}

		if (data.presences) {
			for (var presence of data.presences) {
				var user = client.internal.users.get("id", presence.user.id);
				if (user) {
					user.status = presence.status;
					user.game = presence.game;
				}
			}
		}

		if (data.voice_states) {
			if (this.client.options.bot) {
				for (var voiceState of data.voice_states) {
					let user = this.members.get("id", voiceState.user_id);
					if (user) {
						this.memberMap[user.id] = this.memberMap[user.id] || {};
						this.memberMap[user.id].mute = voiceState.mute || this.memberMap[user.id].mute;
						this.memberMap[user.id].selfMute = voiceState.self_mute === undefined ? this.memberMap[user.id].selfMute : voiceState.self_mute;
						this.memberMap[user.id].deaf = voiceState.deaf || this.memberMap[user.id].deaf;
						this.memberMap[user.id].selfDeaf = voiceState.self_deaf === undefined ? this.memberMap[user.id].selfDeaf : voiceState.self_deaf;
						let channel = this.channels.get("id", voiceState.channel_id);
						if (channel) {
							this.eventVoiceJoin(user, channel);
						} else {
							this.client.emit("warn", "channel doesn't exist even though READY expects them to");
						}
					} else {
						this.client.emit("warn", "user doesn't exist even though READY expects them to");
					}
				}
			} else {
				this.pendingVoiceStates = data.voice_states;
			}
		}
	}

	get webhooks() {
		return this.channels.map(c => c.webhooks).reduce((previousChannel, currentChannel) => {
			if (currentChannel) {
				currentChannel.forEach(webhook => {
					previousChannel.add(webhook);
				});
			}
			return previousChannel;
		}, new _Cache2.default("id"));
	}

	get createdAt() {
		return new Date(+this.id / 4194304 + 1420070400000);
	}

	toObject() {
		var keys = ['id', 'name', 'region', 'ownerID', 'icon', 'afkTimeout', 'afkChannelID', 'large', 'memberCount'],
		    obj = {};

		for (let k of keys) {
			obj[k] = this[k];
		}

		obj.members = this.members.map(member => member.toObject());
		obj.channels = this.channels.map(channel => channel.toObject());
		obj.roles = this.roles.map(role => role.toObject());
		obj.emojis = this.emojis.map(emoji => emoji.toObject());

		return obj;
	}

	detailsOf(user) {
		user = this.client.internal.resolver.resolveUser(user);
		if (user) {
			var result = this.memberMap[user.id] || {};
			if (result && result.roles) {
				result.roles = result.roles.map(pid => this.roles.get("id", pid) || pid);
			}
			return result;
		} else {
			return {};
		}
	}

	detailsOfUser(user) {
		return this.detailsOf(user);
	}

	detailsOfMember(user) {
		return this.detailsOf(user);
	}

	details(user) {
		return this.detailsOf(user);
	}

	rolesOfUser(user) {
		return this.detailsOf(user).roles || [];
	}

	rolesOfMember(member) {
		return this.rolesOfUser(member);
	}

	rolesOf(user) {
		return this.rolesOfUser(user);
	}

	get iconURL() {
		if (!this.icon) {
			return null;
		} else {
			return _Constants.Endpoints.SERVER_ICON(this.id, this.icon);
		}
	}

	get afkChannel() {
		return this.channels.get("id", this.afkChannelID);
	}

	get defaultChannel() {
		return this.channels.get("id", this.id);
	}

	get generalChannel() {
		return this.defaultChannel;
	}

	get general() {
		return this.defaultChannel;
	}

	get owner() {
		return this.members.get("id", this.ownerID);
	}

	toString() {
		return this.name;
	}

	eventVoiceJoin(user, channel) {
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

	eventVoiceStateUpdate(channel, user, data) {
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

	eventVoiceLeave(user) {
		for (let chan of this.channels.getAll("type", 2)) {
			if (chan.members.has("id", user.id)) {
				chan.members.remove(user);
				user.voiceChannel = null;
				return chan;
			}
		}
		return { server: this };
	}

	equalsStrict(obj) {
		if (obj instanceof Server) {
			for (var key of strictKeys) {
				if (obj[key] !== this[key]) {
					return false;
				}
			}
		} else {
			return false;
		}
		return true;
	}

	leave() {
		return this.client.leaveServer.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	delete() {
		return this.client.leaveServer.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	createInvite() {
		return this.client.createInvite.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	createRole() {
		return this.client.createRole.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	banMember(user, tlength, callback) {
		return this.client.banMember.apply(this.client, [user, this, tlength, callback]);
	}

	banUser(user, tlength, callback) {
		return this.client.banMember.apply(this.client, [user, this, tlength, callback]);
	}

	ban(user, tlength, callback) {
		return this.client.banMember.apply(this.client, [user, this, tlength, callback]);
	}

	unbanMember(user, callback) {
		return this.client.unbanMember.apply(this.client, [user, this, callback]);
	}

	unbanUser(user, callback) {
		return this.client.unbanMember.apply(this.client, [user, this, callback]);
	}

	unban(user, callback) {
		return this.client.unbanMember.apply(this.client, [user, this, callback]);
	}

	kickMember(user, callback) {
		return this.client.kickMember.apply(this.client, [user, this, callback]);
	}

	kickUser(user, callback) {
		return this.client.kickMember.apply(this.client, [user, this, callback]);
	}

	kick(user, callback) {
		return this.client.kickMember.apply(this.client, [user, this, callback]);
	}

	getBans() {
		return this.client.getBans.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	createChannel() {
		return this.client.createChannel.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	setNickname() {
		return this.client.setNickname.apply(this.client, (0, _ArgumentRegulariser.reg)(this, arguments));
	}

	membersWithRole(role) {
		return this.members.filter(m => m.hasRole(role));
	}

	usersWithRole(role) {
		return this.membersWithRole(role);
	}
}
exports.default = Server;
//# sourceMappingURL=Server.js.map
