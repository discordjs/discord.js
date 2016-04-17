'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);
const Constants = require('../../../../util/Constants');

const Role = Structure('Role');
const Guild = Structure('Guild');

class GuildRoleDeleteHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let guild = client.store.get('guilds', data.guild_id);

		if (guild) {
			let exists = guild.store.get('roles', data.role_id);
			if (exists) {
				guild.store.remove('roles', data.role_id);
				client.emit(Constants.Events.GUILD_ROLE_DELETE, guild, exists);
			}
		}

	}

};

module.exports = GuildRoleDeleteHandler;
