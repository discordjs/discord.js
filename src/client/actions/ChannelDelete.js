'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const Message = require('../../structures/Message');

class ChannelDeleteAction extends Action {

	constructor(client) {
		super(client);
		this.timeouts = [];
		this.deleted = {};
	}

	handle(data) {
		let client = this.client;
		let channel = client.store.get('channels', data.id);

		if (channel) {

			client.store.KillChannel(channel);
			this.deleted[channel.id] = channel;
			this.scheduleForDeletion(channel.id);

		} else if (this.deleted[data.id]) {

			channel = this.deleted[data.id];

		}

		return {
			channel,
		};
	}

	scheduleForDeletion(id) {
		this.timeouts.push(
			setTimeout(() => delete this.deleted[id],
			this.client.options.rest_ws_bridge_timeout)
		);
	}
};

module.exports = ChannelDeleteAction;
