'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);
const Constants = require('../../../../util/Constants');

const Message = Structure('Message');
const Guild = Structure('Guild');

class MessageDeleteHandler extends AbstractHandler {

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
				channel.store.remove('messages', message.id);
				client.emit(Constants.Events.MESSAGE_DELETE, message);
			}
		}

	}

};

module.exports = MessageDeleteHandler;
