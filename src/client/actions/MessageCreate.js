'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const Message = require('../../structures/Message');

class MessageCreateAction extends Action {

	constructor(client) {
		super(client);
	}

	handle(data) {

		let client = this.client;
		let channel = client.store.get('channels', data.channel_id);

		if (channel) {
			let message = channel._cacheMessage(new Message(channel, data, client));
			return {
				m: message,
			};
		}

		return {
			m: null,
		};
	}
};

module.exports = MessageCreateAction;
