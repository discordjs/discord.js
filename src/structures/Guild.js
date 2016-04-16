'use strict';

const User = require('./User');
const GuildDataStore = require('./datastore/GuildDataStore');
const TextChannel = require('./TextChannel');
const VoiceChannel = require('./VoiceChannel');
const Constants = require('../Util/Constants');

class Guild {
	constructor(client, data) {
		this.client = client;
		this.store = new GuildDataStore();

		if (!data) {
			return;
		}

		if (data.unavailable) {
			this.available = false;
			this.id = data.id;
		} else {
			this.available = true;
			this.setup(data);
		}
	}

	_addMember(guildUser) {
		let user = this.client.store.NewUser(guildUser.user);
		this.store.memberData[user.id] = {
			deaf: guildUser.deaf,
			mute: guildUser.mute,
			joinDate: new Date(guildUser.joined_at),
			roles: guildUser.roles,
		};
		if (this.client.ws.emittedReady) {
			this.client.emit(Constants.Events.GUILD_MEMBER_ADD, this, user);
		}
	}

	_updateMember(currentUser, newData) {
		let oldRoles = this.store.memberData[currentUser.id].roles;
		this.store.currentUser[currentUser.id].roles = newData.roles;
		if (this.client.ws.emittedReady) {
			this.client.emit(Constants.Events.GUILD_MEMBER_ROLES_UPDATE, this, oldRoles, this.store.memberData[currentUser.id].roles);
		}
	}

	_removeMember(guildUser) {
		this.store.remove('members', guildUser);
		if (this.client.ws.emittedReady) {
			this.client.emit(Constants.Events.GUILD_MEMBER_REMOVE, this, guildUser);
		}
	}

	setup(data) {
		this.id = data.id;
		this.available = !data.unavailable;
		this.splash = data.splash;
		this.region = data.region;
		this.ownerID = data.owner_id;
		this.name = data.name;
		this.memberCount = data.member_count;
		this.large = data.large;
		this.joinDate = new Date(data.joined_at);
		this.icon = data.icon;
		this.features = data.features;
		this.emojis = data.emojis;
		this.afkTimeout = data.afk_timeout;
		this.afkChannelID = data.afk_channel_id;
		this.embedEnabled = data.embed_enabled;
		this.embedChannelID = data.embed_channel_id;
		this.verificationLevel = data.verification_level;
		this.features = data.features || [];

		if (data.members) {
			this.store.clear('members');
			for (let guildUser of data.members) {
				this._addMember(guildUser);
			}
		}

		if (data.channels) {
			this.store.clear('channels');
			for (let channel of data.channels) {
				this.client.store.NewChannel(channel, this);
			}
		}
	}
}

module.exports = Guild;
