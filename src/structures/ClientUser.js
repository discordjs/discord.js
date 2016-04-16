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
}

module.exports = ClientUser;
