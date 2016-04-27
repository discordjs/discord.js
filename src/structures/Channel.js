'use strict';

class Channel {
	constructor(client, data, guild) {
		this.client = client;
		this.typingMap = {};
		this.typingTimeouts = [];
		if (guild) {
			this.guild = guild;
		}

		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		this.id = data.id;
	}

	delete() {
		return this.client.rest.methods.DeleteChannel(this);
	}
}

module.exports = Channel;
