"use strict";

/**
 * Types of region for a server, include: `us-west`, `us-east`, `us-south`, `us-central`, `singapore`, `london`, `sydney`, `amsterdam` and `frankfurt`
 * @typedef {(string)} region
 */

import Bucket from "../Util/Bucket";
import Equality from "../Util/Equality";
import {Endpoints} from "../Constants";
import Cache from "../Util/Cache";
import User from "./User";
import TextChannel from "./TextChannel";
import VoiceChannel from "./VoiceChannel";
import Role from "./Role";
import Emoji from "./Emoji";
import {reg} from "../Util/ArgumentRegulariser";

var strictKeys = [
	"region", "ownerID", "name", "id", "icon", "afkTimeout", "afkChannelID"
];

export default class Server extends Equality {

	constructor(data, client) {

		super();

		this.client = client;
		this.id = data.id;

		if(data.owner_id) { // new server data
		    client.internal.buckets["bot:msg:guild:" + this.id] = new Bucket(5, 5000);
            client.internal.buckets["dmsg:" + this.id] = new Bucket(5, 1000);
            client.internal.buckets["bdmsg:" + this.id] = new Bucket(1, 1000);
            client.internal.buckets["guild_member:" + this.id] = new Bucket(10, 10000);
            client.internal.buckets["guild_member_nick:" + this.id] = new Bucket(1, 1000);
        }

		this.region = data.region;
		this.ownerID = data.owner_id || data.ownerID;
		this.name = data.name;
		this.members = new Cache();
		this.channels = new Cache();
		this.roles = new Cache();
		this.emojis = new Cache();
		this.icon = data.icon;
		this.afkTimeout = data.afk_timeout;
		this.afkChannelID = data.afk_channel_id || data.afkChannelID;
		this.memberMap = data.memberMap || {};
		this.memberCount = data.member_count || data.memberCount;
		this.large = data.large || this.memberCount > 250;

		if (data.roles instanceof Cache) {
			data.roles.forEach((role) => this.roles.add(role));
		} else {
			data.roles.forEach((dataRole) => {
				this.roles.add(new Role(dataRole, this, client));
			});
		}

		if (data.emojis instanceof Cache) {
			data.emojis.forEach((emoji) => this.emojis.add(emoji));
		} else {
			data.emojis.forEach((dataEmoji) => {
				this.emojis.add(new Emoji(dataEmoji, this));
			})
		}

		if (data.members instanceof Cache) {
			data.members.forEach((member) => this.members.add(member));
		} else {
			data.members.forEach((dataUser) => {
				this.memberMap[dataUser.user.id] = {
					roles: dataUser.roles,
					mute: dataUser.mute,
					selfMute: dataUser.self_mute,
					deaf: dataUser.deaf,
					selfDeaf: dataUser.self_deaf,
					joinedAt: Date.parse(dataUser.joined_at),
					nick: dataUser.nick || null
				};
				this.members.add(client.internal.users.add(new User(dataUser.user, client)));
			});
		}

		if (data.channels instanceof Cache) {
			data.channels.forEach((channel) => this.channels.add(channel));
		} else {
			data.channels.forEach((dataChannel) => {
				if (dataChannel.type === "text") {
					this.channels.add(client.internal.channels.add(new TextChannel(dataChannel, client, this)));
				} else {
					this.channels.add(client.internal.channels.add(new VoiceChannel(dataChannel, client, this)));
				}
			});
		}

		if (data.presences) {
			for (var presence of data.presences) {
				var user = client.internal.users.get("id", presence.user.id);
				if(user) {
					user.status = presence.status;
					user.game = presence.game;
				}
			}
		}

		if (data.voice_states) {
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
		}
	}

	get createdAt() {
		return new Date((+this.id / 4194304) + 1420070400000);
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
			if(result && result.roles) {
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
			return Endpoints.SERVER_ICON(this.id, this.icon);
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
		if (oldState.mute !== undefined && (oldState.mute != data.mute || oldState.self_mute != data.self_mute
			|| oldState.deaf != data.deaf || oldState.self_deaf != data.self_deaf)) {
			this.client.emit("voiceStateUpdate", channel, user, oldState, this.memberMap[user.id]);
		} else {
			this.eventVoiceJoin(user, channel);
		}
	}

	eventVoiceLeave(user) {
		for (let chan of this.channels.getAll("type", "voice")) {
			if (chan.members.has("id", user.id)) {
				chan.members.remove(user);
				user.voiceChannel = null;
				return chan;
			}
		}
		return {server: this};
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
		return this.client.leaveServer.apply(this.client, reg(this, arguments));
	}

	delete() {
		return this.client.leaveServer.apply(this.client, reg(this, arguments));
	}

	createInvite() {
		return this.client.createInvite.apply(this.client, reg(this, arguments));
	}

	createRole() {
		return this.client.createRole.apply(this.client, reg(this, arguments));
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
		return this.client.getBans.apply(this.client, reg(this, arguments));
	}

	createChannel() {
		return this.client.createChannel.apply(this.client, reg(this, arguments));
	}

	setNickname() {
		return this.client.setNickname.apply(this.client, reg(this, arguments));
	}

	membersWithRole(role) {
		return this.members.filter(m => m.hasRole(role));
	}

	usersWithRole(role) {
		return this.membersWithRole(role);
	}
}
