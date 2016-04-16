'use strict';

class Channel {
	constructor(client, data) {
		this.client = client;
		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		this.id = data.id;
	}
}

module.exports = Channel;
