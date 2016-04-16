'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);

const ClientUser = Structure('ClientUser');
const Guild = Structure('Guild');

const Constants = require('../../../../util/Constants');

class GuildCreateHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let guild = client.store.get('guilds', data.id);

		if (guild) {
			if (!guild.available && !data.unavailable) {
				// a newly available guild
				guild.setup(data);
				this.packetManager.ws.checkIfReady();
			}
		} else {
			// a new guild
			client.store.NewGuild(data);
		}

	}

};

module.exports = GuildCreateHandler;
