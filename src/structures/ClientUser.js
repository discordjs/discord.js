'use strict';

const User = require('./User');

class ClientUser extends User {
	constructor(client, data) {
		super(client, data);
	}

	setup(data) {
		super.setup(data);
		this.verified = data.verified;
		this.email = data.email;
	}

	setUsername(username) {
		return this.client.rest.methods.UpdateCurrentUser({ username, });
	}

	setEmail(email) {
		return this.client.rest.methods.UpdateCurrentUser({ email, });
	}

	setPassword(password) {
		return this.client.rest.methods.UpdateCurrentUser({ password, });
	}

	setAvatar(avatar) {
		return this.client.rest.methods.UpdateCurrentUser({ avatar, });
	}

	edit(data) {
		return this.client.rest.methods.UpdateCurrentUser(data);
	}
}

module.exports = ClientUser;
