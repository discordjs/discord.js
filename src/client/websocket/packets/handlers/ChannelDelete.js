'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);

const ClientUser = Structure('ClientUser');
const Guild = Structure('Guild');
const ServerChannel = Structure('ServerChannel');

const Constants = require('../../../../util/Constants');

class ChannelDeleteHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let response = client.actions.ChannelDelete.handle(data);

		if (response.channel) {
			client.emit(Constants.Events.CHANNEL_DELETE, response.channel);
		}
	}

};

module.exports = ChannelDeleteHandler;
