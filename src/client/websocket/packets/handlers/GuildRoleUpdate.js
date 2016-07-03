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

		let response = client.actions.GuildRoleUpdate.handle(data);
	}

};

module.exports = GuildRoleUpdateHandler;
