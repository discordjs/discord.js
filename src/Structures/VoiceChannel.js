"use strict";

var Channel = require("./Channel.js");

class VoiceChannel extends Channel{
	constructor(data, client){
		super(data, client);
	}
}

module.exports = VoiceChannel;