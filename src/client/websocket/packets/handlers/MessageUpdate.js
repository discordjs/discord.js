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
		let channel = client.store.get('channels', data.channel_id);

		if (channel) {
			let message = channel.store.get('messages', data.id);
			if (message) {
				let oldMessage = CloneObject(message);
				message.patch(data);
				client.emit(Constants.Events.MESSAGE_UPDATE, oldMessage, message);
			}
		}

	}

};

module.exports = MessageUpdateHandler;
