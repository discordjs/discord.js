"use strict";

var ServerChannel = require("./ServerChannel.js");

class VoiceChannel extends ServerChannel{
	constructor(data, client){
		super(data, client);
	}
}

module.exports = VoiceChannel;