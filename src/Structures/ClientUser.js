const Constants = require("../util/Constants");
const User = require("./User");

class ClientUser extends User{
	constructor(client, data) {
		super(client, data);
		this.verified = data.verified;
		this.email = data.email;
	}
}

module.exports = ClientUser;