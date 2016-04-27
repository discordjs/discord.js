'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const Message = require('../../structures/Message');

class ChannelDeleteAction extends Action {

	constructor(client) {
		super(client);
	}

	handle(data) {
		let client = this.client;
		let channel = client.store.get('channels', data.id);

		if (channel) {
			client.store.KillChannel(channel);
		}

		return {
			channel,
		};
	}
};

module.exports = ChannelDeleteAction;
