'use strict';

const TextBasedChannel = require('./interface/TextBasedChannel');

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
		this.status = data.status || this.status || 'offline';
		this.game = data.game || this.game;
	}

	toString() {
		return `<@${this.id}>`;
	}

	deleteDM() {
		return this.client.rest.methods.DeleteChannel(this);
	}

	equals(user) {
		let base = (
			this.username === user.username &&
			this.id === user.id &&
			this.discriminator === user.discriminator &&
			this.avatar === user.avatar &&
			this.bot === Boolean(user.bot)
		);

		if (base) {
			if (user.status) {
				base = this.status === user.status;
			}

			if (user.game) {
				base = this.game === user.game;
			}
		}

		return base;
	}
}

TextBasedChannel.applyToClass(User);

module.exports = User;
