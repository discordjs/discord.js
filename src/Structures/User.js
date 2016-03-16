class User {
	constructor(client, data) {
		this.client = client;
		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		this.username = data.username || this.username;
		this.id = data.id || this.id;
		this.discriminator = data.discriminator || this.discriminator;
		this.avatar = data.avatar || this.avatar;
	}
}

module.exports = User;
