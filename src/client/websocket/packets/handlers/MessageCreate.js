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
		let channel = client.store.get('channels', data.channel_id);

		if (channel) {
			let message = new Message(channel, data, client);
			channel._cacheMessage(message);
			client.emit(Constants.Events.MESSAGE_CREATE, message);
		}

	}

};

module.exports = MessageCreateHandler;
