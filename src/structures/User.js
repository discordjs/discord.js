'use strict';

class User {
	constructor(client, data) {
		this.client = client;
		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		this.username = data.username;
		this.id = data.id;
		this.discriminator = data.discriminator;
		this.avatar = data.avatar;
		this.bot = Boolean(data.bot);
		this.status = data.status || 'offline';
		this.game = data.game;
	}

	toString() {
		return `<@${this.id}>`;
	}
}

module.exports = User;
