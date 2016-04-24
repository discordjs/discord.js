'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const Message = require('../../structures/Message');

class MessageDeleteAction extends Action {

	constructor(client) {
		super(client);
		this.timeouts = [];
	}

	handle(data) {
		let client = this.client;
		let channel = client.store.get('channels', data.channel_id);
		if (channel) {
			let message = channel.store.get('messages', data.id);
			if (message && !message._deleted) {
				message._deleted = true;
				this.scheduleForDeletion(channel, message.id);
			}

			return {
				m: message,
			};
		}

		return {
			m: null,
		};
	}

	scheduleForDeletion(channel, id) {
		this.timeouts.push(
			setTimeout(() => channel.store.remove('messages', id),
			this.client.options.rest_ws_bridge_timeout)
		);
	}
};

module.exports = MessageDeleteAction;
