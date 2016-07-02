'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const Role = require('../../structures/Role');

class GuildRoleCreate extends Action {

	constructor(client) {
		super(client);
	}

	handle(data) {

		let client = this.client;
		let guild = client.store.get('guilds', data.guild_id);

		if (guild) {
			let already = guild.store.get('roles', data.role.id);
			let role = new Role(guild, data.role);
			guild.store.add('roles', role);

			if (!already) {
				client.emit(Constants.Events.GUILD_ROLE_CREATE, guild, role);
			}

			return {
				role,
			};
		}

		return {
			role: null,
		};
	}
};

module.exports = GuildRoleCreate;
