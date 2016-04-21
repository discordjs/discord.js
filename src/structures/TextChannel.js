'use strict';

const ServerChannel = require('./ServerChannel');
const TextChannelDataStore = require('./datastore/TextChannelDataStore');
const TextBasedChannel = require('./interface/TextBasedChannel');

class TextChannel extends ServerChannel {

	constructor(guild, data) {
		super(guild, data);
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
}

TextBasedChannel.applyToClass(TextChannel);

module.exports = TextChannel;
