'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);

const ClientUser = Structure('ClientUser');
const Guild = Structure('Guild');

const Constants = require('../../../../util/Constants');
const CloneObject = require('../../../../util/CloneObject');

class GuildUpdateHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let guild = client.store.get('guilds', data.id);

		if (guild) {
			client.store.UpdateGuild(guild, data);
		}

	}

};

module.exports = GuildUpdateHandler;
