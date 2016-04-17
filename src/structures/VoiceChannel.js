'use strict';

const ServerChannel = require('./ServerChannel');
const VoiceChannelDataStore = require('./datastore/VoiceChannelDataStore');

class VoiceChannel extends ServerChannel {
	constructor(guild, data) {
		super(guild, data);
		this.store = new VoiceChannelDataStore();
	}

	setup(data) {
		super.setup(data);
		this.bitrate = data.bitrate;
	}
}

module.exports = VoiceChannel;
