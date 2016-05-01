'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);
const CloneObject = name => require(`../../../../util/CloneObject`);
const Constants = require(`../../../../util/Constants`);

const ClientUser = Structure('ClientUser');
const Guild = Structure('Guild');
const DMChannel = Structure('DMChannel');

class UserUpdateHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let response = client.actions.UserUpdate.handle(data);

	}

};

module.exports = UserUpdateHandler;
