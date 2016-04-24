'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const CloneObject = require('../../util/CloneObject');
const Message = require('../../structures/Message');

class MessageUpdateAction extends Action {

	constructor(client) {
		super(client);
	}

	handle(data) {

		let client = this.client;
		let channel = client.store.get('channels', data.channel_id);

		if (channel) {
			let message = channel.store.get('messages', data.id);
			if (message && !message.equals(data, true)) {
				let oldMessage = CloneObject(message);
				message.patch(data);
				return {
					old: oldMessage,
					updated: message,
				};
			}
		}

		return {
			old: null,
			updated: null,
		};
	}
};

module.exports = MessageUpdateAction;
