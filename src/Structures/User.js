const Constants = require("../util/Constants");
const DataStore = require("../util/DataStore");

class User{
	constructor(client, data) {
		this.client = client;
		this.username = data.username;
		this.id = data.id;
		this.discriminator = data.discriminator;
		this.avatar = data.avatar;
	}
}

module.exports = User;