'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);
const Constants = require('../../../../util/Constants');
const CloneObject = require('../../../../util/CloneObject');

const Message = Structure('Message');
const Guild = Structure('Guild');

class MessageUpdateHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let response = client.actions.MessageUpdate.handle(data);

		if (response.old) {
			client.emit(Constants.Events.MESSAGE_UPDATE, response.old, response.updated);
		}

	}

};

module.exports = MessageUpdateHandler;
