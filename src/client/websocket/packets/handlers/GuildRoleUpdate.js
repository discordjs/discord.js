'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);
const Constants = require('../../../../util/Constants');
const CloneObject = require('../../../../util/CloneObject');

const Role = Structure('Role');
const Guild = Structure('Guild');

class GuildRoleUpdateHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let guild = client.store.get('guilds', data.guild_id);

		if (guild) {
			let existingRole = guild.store.get('roles', data.role.id);
			if (existingRole) {
				let oldRole = CloneObject(existingRole);
				existingRole.setup(data.role);
				client.emit(Constants.Events.GUILD_ROLE_UPDATE, guild, oldRole, existingRole);
			}
		}

	}

};

module.exports = GuildRoleUpdateHandler;
