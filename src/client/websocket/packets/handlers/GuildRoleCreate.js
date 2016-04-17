'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);
const Constants = require('../../../../util/Constants');

const Role = Structure('Role');
const Guild = Structure('Guild');

class GuildRoleCreateHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let guild = client.store.get('guilds', data.guild_id);

		if (guild) {
			let already = guild.store.get('roles', data.role.id);
			let role = new Role(guild, data.role);
			guild.store.add('roles', role);

			if (!already) {
				client.emit(Constants.Events.GUILD_ROLE_CREATE, guild, role);
			}
		}

	}

};

module.exports = GuildRoleCreateHandler;
