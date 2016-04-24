'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);
const Constants = require('../../../../util/Constants');

const Message = Structure('Message');
const Guild = Structure('Guild');

class MessageCreateHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let response = client.actions.MessageCreate.handle(data);

		if (response.m) {
			client.emit(Constants.Events.MESSAGE_CREATE, response.m);
		}
	}

};

module.exports = MessageCreateHandler;
