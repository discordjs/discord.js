'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const CloneObject = require('../../util/CloneObject');
const Message = require('../../structures/Message');

class ChannelUpdateAction extends Action {

	constructor(client) {
		super(client);
	}

	handle(data) {

		let client = this.client;
		let channel = client.store.get('channels', data.id);

		if (channel) {
			let oldChannel = CloneObject(channel);
			channel.setup(data);
			if (!oldChannel.equals(data)) {
				client.emit(Constants.Events.CHANNEL_UPDATE, oldChannel, channel);
			}

			return {
				old: oldChannel,
				updated: channel,
			};
		}

		return {
			old: null,
			updated: null,
		};
	}
};

module.exports = ChannelUpdateAction;
