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
		this.ownerID = data.owner_id;
		this.name = data.name;
		this.id = data.id;
		this.members = new Cache();
		this.channels = new Cache();
		this.roles = new Cache();
		this.icon = data.icon;
		this.afkTimeout = data.afkTimeout;
		this.afkChannelID = data.afk_channel_id;
		this.memberMap = {};

		var self = this;

		data.roles.forEach((dataRole) => {
			this.roles.add(new Role(dataRole, this, client));
		});

		data.members.forEach((dataUser) => {
			this.memberMap[dataUser.user.id] = {
				roles: dataUser.roles.map((pid) => self.roles.get("id", pid)),
				mute: dataUser.mute,
				deaf: dataUser.deaf,
				joinedAt: Date.parse(dataUser.joined_at)
			};
			var user = client.internal.users.add(new User(dataUser.user, client));
			this.members.add(user);
		});

		data.channels.forEach((dataChannel) => {
			if (dataChannel.type === "text") {
				var channel = client.internal.channels.add(new TextChannel(dataChannel, client, this));
				this.channels.add(channel);
			} else {
				var channel = client.internal.channels.add(new VoiceChannel(dataChannel, client, this));
				this.channels.add(channel);
			}
		});

		if (data.presences) {
			for (var presence of data.presences) {
				var user = client.internal.users.get("id", presence.user.id);
				if (user) {
					user.status = presence.status;
					user.gameID = presence.game_id;
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
		return this.details(user);
	}

	rolesOfUser(user) {
		user = this.client.internal.resolver.resolveUser(user);
		if (user) {
			return (this.memberMap[user.id] ? this.memberMap[user.id].roles : []);
		} else {
			return null;
		}
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

}
