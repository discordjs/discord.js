'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const Message = require('../../structures/Message');

class ChannelCreateAction extends Action {

	constructor(client) {
		super(client);
	}

	handle(data) {
		let client = this.client;
		let channel = client.store.NewChannel(data);

		return {
			channel,
		};
	}
};

module.exports = ChannelCreateAction;
