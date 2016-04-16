'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);

const ClientUser = Structure('ClientUser');
const Guild = Structure('Guild');

const Constants = require('../../../../util/Constants');

class GuildDeleteHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let guild = client.store.get('guilds', data.id);

		if (guild) {
			if (guild.available && data.unavailable) {
				// guild is unavailable
				guild.available = false;
				client.emit(Constants.Events.GUILD_UNAVAILABLE, guild);
			} else {
				// delete guild
				client.store.KillGuild(guild);
			}
		} else {
			// it's not there! :(
			client.emit('warn', 'guild deleted but not cached in first place. missed packet?');
		}

	}

};

module.exports = GuildDeleteHandler;
