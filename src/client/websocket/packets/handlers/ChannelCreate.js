'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);

const ClientUser = Structure('ClientUser');
const Guild = Structure('Guild');
const DMChannel = Structure('DMChannel');

const Constants = require('../../../../util/Constants');

class ChannelCreateHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let response = client.actions.ChannelCreate.handle(data);

		if (response.channel) {
			client.emit(Constants.Events.CHANNEL_CREATE, response.channel);
		}

	}

};

module.exports = ChannelCreateHandler;
