'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const CloneObject = require('../../util/CloneObject');
const Message = require('../../structures/Message');

class GuildUpdateAction extends Action {

	constructor(client) {
		super(client);
		this.deleted = {};
		this.timeouts = [];
	}

	handle(data) {

		let client = this.client;
		let guild = client.store.get('guilds', data.id);

		if (guild) {
			let oldGuild = CloneObject(guild);
			guild.setup(data);

			if (!oldGuild.equals(data)) {
				client.emit(Constants.Events.GUILD_UPDATE, oldGuild, guild);
			}

			return {
				old: oldGuild,
				updated: guild,
			};
		}

		return {
			old: null,
			updated: null,
		};
	}
};

module.exports = GuildUpdateAction;
