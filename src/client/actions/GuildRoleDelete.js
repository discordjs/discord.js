'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const Message = require('../../structures/Message');

class GuildRoleDeleteAction extends Action {

	constructor(client) {
		super(client);
		this.timeouts = [];
		this.deleted = {};
	}

	handle(data) {
		let client = this.client;
		let guild = client.store.get('guilds', data.guild_id);

		if (guild) {
			let exists = guild.store.get('roles', data.role_id);
			if (exists) {
				guild.store.remove('roles', data.role_id);
				this.deleted[guild.id + data.role_id] = exists;
				this.scheduleForDeletion(guild.id, data.role_id);
				client.emit(Constants.Events.GUILD_ROLE_DELETE, guild, exists);
			}

			if (!exists) {
				exists = this.deleted[guild.id + data.role_id];
			}

			return {
				role: exists,
			};
		}

		return {
			role: null,
		};
	}

	scheduleForDeletion(guildID, roleID) {
		this.timeouts.push(
			setTimeout(() => delete this.deleted[guildID + roleID],
			this.client.options.rest_ws_bridge_timeout)
		);
	}
};

module.exports = GuildRoleDeleteAction;
