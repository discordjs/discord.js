const Constants = require('../util/Constants');
const User = require('./User');

class ClientUser extends User {
	constructor(client, data) {
		super(client, data);
		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		super.setup(data);
		this.verified = data.verified || this.verified;
		this.email = data.email || this.email;
	}
}

module.exports = ClientUser;
