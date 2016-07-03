'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const CloneObject = require('../../util/CloneObject');
const Message = require('../../structures/Message');

class GuildRoleUpdateAction extends Action {

	constructor(client) {
		super(client);
	}

	handle(data) {

		let client = this.client;
		let guild = client.store.get('guilds', data.guild_id);

		let roleData = data.role;

		if (guild) {
			let oldRole;
			let existingRole = guild.store.get('roles', roleData.id);
			// exists and not the same
			if (existingRole && !existingRole.equals(roleData)) {
				oldRole = CloneObject(existingRole);
				existingRole.setup(data.role);
				client.emit(Constants.Events.GUILD_ROLE_UPDATE, guild, oldRole, existingRole);
			}

			return {
				old: oldRole,
				updated: existingRole,
			};
		}

		return {
			old: null,
			updated: null,
		};
	}
};

module.exports = GuildRoleUpdateAction;
