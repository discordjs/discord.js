const ServerChannel = require('./ServerChannel');

class VoiceChannel extends ServerChannel {
	constructor(client, server, data) {
		super(client, server, data);

		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		super.setup(data);
	}
}

module.exports = VoiceChannel;
