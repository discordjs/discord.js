'use strict';

// ##untested handler##

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);

const ClientUser = Structure('ClientUser');
const Guild = Structure('Guild');

const Constants = require('../../../../util/Constants');

class GuildMemberRemoveHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let response = client.actions.GuildMemberRemove.handle(data);

		if (response.m) {
			client.emit(Constants.Events.GUILD_MEMBER_REMOVE, response.g, response.m);
		}
	}

};

module.exports = GuildMemberRemoveHandler;
