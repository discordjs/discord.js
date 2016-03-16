const ServerChannel = require('./ServerChannel');

class TextChannel extends ServerChannel {
	constructor(client, server, data) {
		super(client, server, data);

		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		super.setup(data);

		let client = this.client;

		this.topic           = data.topic;
		this.last_message_id = data.last_message_id;
	}
}

module.exports = TextChannel;
