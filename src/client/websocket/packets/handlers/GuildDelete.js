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

		let response = client.actions.GuildDelete.handle(data);

		if (response.guild) {
			client.emit(Constants.Events.GUILD_DELETE, response.guild);
		}

	}

};

module.exports = GuildDeleteHandler;
