'use strict';

const Structure = name => require(`../structures/${name}`);

const User = Structure('User');
const Message = Structure('Message');
const Guild = Structure('Guild');
const Channel = Structure('Channel');
const ServerChannel = Structure('ServerChannel');
const TextChannel = Structure('TextChannel');
const VoiceChannel = Structure('VoiceChannel');
const GuildMember = Structure('GuildMember');

function $string(obj) {
	return (typeof obj === 'string' || obj instanceof String);
}

class ClientDataResolver {

	constructor(client) {
		this.client = client;
	}

	ResolveUser(user) {
		if (user instanceof User) {
			return user;
		}else if ($string(user)) {
			return this.client.store.get('users', user);
		}else if (user instanceof Message) {
			return user.author;
		}else if (user instanceof Guild) {
			return user.owner;
		}

		return null;
	}

	ResolveGuild(guild) {
		if (guild instanceof Guild) {
			return guild;
		}
	}

	ResolveGuildMember(guild, user) {
		if (user instanceof GuildMember) {
			return user;
		}

		guild = this.ResolveGuild(guild);
		user = this.ResolveUser(user);

		if (!guild || !user) {
			return null;
		}

		return guild.store.get('members', user.id);
	}

	ResolveBase64(data) {
		if (data instanceof Buffer) {
			return 'data:image/jpg;base64,' + data.toString('base64');
		}

		return data;
	}

	ResolveChannel(channel) {
		if (channel instanceof Channel) {
			return channel;
		}

		if ($string(channel)) {
			return this.client.store.get('channels', channel);
		}
	}

	ResolveString(data) {
		if (data instanceof String) {
			return data;
		}

		if (data instanceof Array) {
			return data.join('\n');
		}

		return String(data);
	}
}

module.exports = ClientDataResolver;
