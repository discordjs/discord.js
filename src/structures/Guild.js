'use strict';

const User = require('./User');
const GuildMember = require('./GuildMember');
const GuildDataStore = require('./datastore/GuildDataStore');
const TextChannel = require('./TextChannel');
const VoiceChannel = require('./VoiceChannel');
const Constants = require('../Util/Constants');
const Role = require('./Role');

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

	_addMember(guildUser, noEvent) {
		if (!(guildUser.user instanceof User)) {
			guildUser.user = this.client.store.NewUser(guildUser.user);
		}

		guildUser.joined_at = guildUser.joined_at || 0;
		let member = this.store.add('members', new GuildMember(this, guildUser));
		if (this.client.ws.status === Constants.Status.READY && !noEvent) {
			this.client.emit(Constants.Events.GUILD_MEMBER_ADD, this, member);
		}

		return member;
	}

	_updateMember(member, data) {
		let oldRoles = member.roles;

		member._roles = data.roles;
		if (this.client.ws.status === Constants.Status.READY) {
			this.client.emit(Constants.Events.GUILD_MEMBER_ROLES_UPDATE, this, oldRoles, member.roles);
		}
	}

	_removeMember(guildMember) {
		this.store.remove('members', guildMember);
		if (this.client.ws.status === Constants.Status.READY) {
			this.client.emit(Constants.Events.GUILD_MEMBER_REMOVE, this, guildMember);
		}
	}

	toString() {
		return this.name;
	}

	member(user) {
		return this.client.resolver.ResolveGuildMember(this, user);
	}

	setup(data) {
		this.id = data.id;
		this.available = !data.unavailable;
		this.splash = data.splash;
		this.region = data.region;
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

		this.owner = this.store.get('members', data.owner_id);

		if (data.channels) {
			this.store.clear('channels');
			for (let channel of data.channels) {
				this.client.store.NewChannel(channel, this);
			}
		}

		if (data.roles) {
			this.store.clear('roles');
			for (let role of data.roles) {
				this.store.add('roles', new Role(this, role));
			}
		}

		if (data.presences) {
			for (let presence of data.presences) {
				let user = this.client.store.get('users', presence.user.id);
				if (user) {
					user.status = presence.status;
					user.game = presence.game;
				}
			}
		}

		if (data.voice_states) {
			for (let voiceState of data.voice_states) {
				let member = this.store.get('members', voiceState.user_id);
				if (member) {
					member.serverMute = voiceState.mute;
					member.serverDeaf = voiceState.deaf;
					member.selfMute = voiceState.self_mute;
					member.selfDeaf = voiceState.self_deaf;
					member.voiceSessionID = voiceState.session_id;
					member.voiceChannelID = voiceState.channel_id;
				}
			}
		}
	}

	get channels() { return this.store.getAsArray('channels'); }

	get $channels() { return this.store.data.channels; }

	get roles() { return this.store.getAsArray('roles'); }

	get $roles() { return this.store.data.roles; }

	get members() { return this.store.getAsArray('members'); }

	get $members() { return this.store.data.members; }
}

module.exports = Guild;
