const Constants = require("../util/Constants");
const ServerChannel = require("./ServerChannel");
const User = require("./User");

class VoiceChannel extends ServerChannel {
	constructor(client, server, data) {
		super(client, server, data);
		if(data)
			this.setup(data);
	}

	setup(data) {
		super.setup(data);
	}
}

module.exports = VoiceChannel;