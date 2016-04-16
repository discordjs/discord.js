'use strict';

const ServerChannel = require('./ServerChannel');
const TextChannelDataStore = require('./datastore/TextChannelDataStore');

class TextChannel extends ServerChannel {
	constructor(guild, data) {
		super(guild, data);
		this.store = new TextChannelDataStore();
	}
}

module.exports = TextChannel;
