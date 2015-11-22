"use strict";

var ServerChannel = require("./ServerChannel.js");

class VoiceChannel extends ServerChannel {
	constructor(data, client, server) {
		super(data, client, server);
	}
}

module.exports = VoiceChannel;