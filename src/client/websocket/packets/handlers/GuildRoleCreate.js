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

		let response = client.actions.GuildRoleCreate.handle(data);
	}

};

module.exports = GuildRoleCreateHandler;
