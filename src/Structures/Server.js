"use strict";

import Equality from "../Util/Equality";
import {Endpoints} from "../Constants";
import Cache from "../Util/Cache";
import User from "./User";
import TextChannel from "./TextChannel";
import VoiceChannel from "./VoiceChannel";
import Role from "./Role";
import {reg} from "../Util/ArgumentRegulariser";

var strictKeys = [
	"region", "ownerID", "name", "id", "icon", "afkTimeout", "afkChannelID"
];

export default class Server extends Equality {
	constructor(data, client) {

		super();

		var self = this;
		this.client = client;

		this.region = data.region;
		this.ownerID = data.owner_id || data.ownerID;
		this.name = data.name;
		this.id = data.id;
		this.members = new Cache();
		this.channels = new Cache();
		this.roles = new Cache();
		this.icon = data.icon;
		this.afkTimeout = data.afkTimeout;
		this.afkChannelID = data.afk_channel_id || data.afkChannelID;
		this.memberMap = {};

		var self = this;

		if (data.roles instanceof Cache) {
			data.roles.forEach((role) => this.roles.add(role));
		} else {
			data.roles.forEach((dataRole) => {
				this.roles.add(new Role(dataRole, this, client));
			});
		}

		if (data.members instanceof Cache) {
			data.members.forEach((member) => this.members.add(member));
		} else {
			data.members.forEach((dataUser) => {
				this.memberMap[dataUser.user.id] = {
					roles: dataUser.roles.map((pid) => self.roles.get("id", pid)),
					mute: dataUser.mute,
					self_mute: dataUser.self_mute,
					deaf: dataUser.deaf,
					self_deaf: dataUser.self_deaf,
					joinedAt: Date.parse(dataUser.joined_at)
				};
				var user = client.internal.users.add(new User(dataUser.user, client));
				this.members.add(user);
			});
		}

		if (data.channels instanceof Cache) {
			data.channels.forEach((channel) => this.channels.add(channel));
		} else {
			data.channels.forEach((dataChannel) => {
				if (dataChannel.type === "text") {
					var channel = client.internal.channels.add(new TextChannel(dataChannel, client, this));
					this.channels.add(channel);
				} else {
					var channel = client.internal.channels.add(new VoiceChannel(dataChannel, client, this));
					this.channels.add(channel);
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
			for (var voiceState of data.voice_states) {
				let user = this.members.get("id", voiceState.user_id);
				let channel = this.channels.get("id", voiceState.channel_id);
				if (user && channel) {
					this.eventVoiceJoin(user, channel);
				} else {
					this.client.emit("warn", "user doesn't exist even though READY expects them to");
				}
			}
		}
	}

	detailsOf(user) {
		user = this.client.internal.resolver.resolveUser(user);
		if (user) {
			return this.memberMap[user.id];
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
		user = this.client.internal.resolver.resolveUser(user);
		if (user) {
			return (this.memberMap[user.id] ? this.memberMap[user.id].roles : []);
		} else {
			return null;
		}
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
		this.eventVoiceLeave(user);

		channel.members.add(user);
		user.voiceChannel = channel;
	}

	eventVoiceStateUpdate(channel, user, data) {
		// removes from other speaking channels first
		if (!this.memberMap[user.id]) {
			this.memberMap[user.id] = {};
		}
		var oldState = {
			mute: this.memberMap[user.id].mute,
			self_mute: this.memberMap[user.id].self_mute,
			deaf: this.memberMap[user.id].deaf,
			self_deaf: this.memberMap[user.id].self_deaf
		};
		this.memberMap[user.id].mute = data.mute;
		this.memberMap[user.id].self_mute = data.self_mute;
		this.memberMap[user.id].deaf = data.deaf;
		this.memberMap[user.id].self_deaf = data.self_deaf;
		if ((oldState.mute != data.mute || oldState.self_mute != data.self_mute
			|| oldState.deaf != data.deaf || oldState.self_deaf != data.self_deaf)
			&& oldState.mute !== undefined) {
			this.client.emit("voiceStateUpdate", channel, user, oldState, this.memberMap[user.id]);
		} else {
			this.eventVoiceJoin(user, channel);
			this.client.emit("voiceJoin", channel, user);
		}
	}

	eventVoiceLeave(user) {
		for (let chan of this.channels.getAll("type", "voice")) {
			if (chan.members.has(user)) {
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

	membersWithRole(role) {
		return this.members.filter(m => m.hasRole(role));
	}

	usersWithRole(role) {
		return this.membersWithRole(role);
	}
}
