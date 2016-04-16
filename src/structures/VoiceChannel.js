'use strict';

const ServerChannel = require('./ServerChannel');

class VoiceChannel extends ServerChannel {
	constructor(guild, data) {
		super(guild, data);
	}

	setup(data) {
		super.setup(data);
		this.bitrate = data.bitrate;
	}
}

module.exports = VoiceChannel;
