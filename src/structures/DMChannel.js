'use strict';

const Channel = require('./Channel');
const TextBasedChannel = require('./interface/TextBasedChannel');
const User = require('./User');
const TextChannelDataStore = require('./datastore/TextChannelDataStore');

class DMChannel extends Channel{
	constructor(client, data) {
		super(client, data);
		this.store = new TextChannelDataStore();
	}

	_cacheMessage(message) {
		let maxSize = this.client.options.max_message_cache;
		if (maxSize === 0) {
			// saves on performance
			return;
		}

		let storeKeys = Object.keys(this.store);
		if (storeKeys.length >= maxSize) {
			this.store.remove(storeKeys[0]);
		}

		this.store.add('messages', message);
	}

	setup(data) {
		super.setup(data);
		this.recipient = this.client.store.add('users', new User(this.client, data.recipient));
		this.lastMessageID = data.last_message_id;
	}

	toString() {
		return this.recipient.toString();
	}
}

TextBasedChannel.applyToClass(DMChannel);

module.exports = DMChannel;
