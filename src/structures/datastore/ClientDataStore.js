'use strict';

const AbstractDataStore = require('./AbstractDataStore');
const Constants = require('../../util/Constants');
const CloneObject = require('../../util/CloneObject');
const Guild = require('../Guild');
const User = require('../User');
const DMChannel = require('../DMChannel');
const TextChannel = require('../TextChannel');
const VoiceChannel = require('../VoiceChannel');
const ServerChannel = require('../ServerChannel');

class ClientDataStore extends AbstractDataStore{
	constructor(client) {
		super();

		this.client = client;
		this.token = null;
		this.session = null;
		this.user = null;

		this.register('users');
		this.register('guilds');
		this.register('channels');
	}

	get pastReady() {
		return this.client.ws.emittedReady;
	}

	NewGuild(data) {
		let already = this.get('guilds', data.id);
		let guild = this.add('guilds', new Guild(this.client, data));
		if (this.pastReady && !already) {
			this.client.emit(Constants.Events.GUILD_CREATE, guild);
		}

		return guild;
	}

	NewUser(data) {
		return this.add('users', new User(this.client, data));
	}

	NewChannel(data, guild) {
		let already = this.get('channels', data.id);
		let channel;
		if (data.is_private) {
			channel = new DMChannel(this.client, data);
		}else {
			guild = guild || this.get('guilds', data.guild_id);
			if (guild) {
				if (data.type === 'text') {
					channel = new TextChannel(guild, data);
					guild.store.add('channels', channel);
				}else if (data.type === 'voice') {
					channel = new VoiceChannel(guild, data);
					guild.store.add('channels', channel);
				}
			}
		}

		if (channel) {
			if (this.pastReady && !already) {
				this.client.emit(Constants.Events.CHANNEL_CREATE, channel);
			}

			return this.add('channels', channel);
		}
	}

	KillGuild(guild) {
		let already = this.get('guilds', guilds.id);
		this.remove('guilds', guild);
		if (already && this.pastReady) {
			this.client.emit(Constants.Events.GUILD_DELETE, guild);
		}
	}

	KillUser(user) {
		this.remove('users', user);
	}

	KillChannel(channel) {
		let already = this.get('channels', channel.id);
		this.remove('channels', channel);
		if (channel instanceof ServerChannel) {
			channel.guild.store.remove('channels', channel);
		}

		if (already && this.pastReady) {
			this.client.emit(Constants.Events.CHANNEL_DELETE, channel);
		}
	}

	UpdateGuild(currentGuild, newData) {
		let oldGuild = CloneObject(currentGuild);
		currentGuild.setup(newData);
		if (this.pastReady) {
			this.client.emit(Constants.Events.GUILD_UPDATE, oldGuild, currentGuild);
		}
	}

	UpdateChannel(currentChannel, newData) {
		let oldChannel = CloneObject(currentChannel);
		currentChannel.setup(newData);
		this.client.emit(Constants.Events.CHANNEL_UPDATE, oldChannel, currentChannel);
	}
}

module.exports = ClientDataStore;
