class ServerChannel {
	constructor(client, server, data) {
		this.client = client;
		this.server = server;

		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		let client = this.client;

		this.id                    = data.id;
		this.name                  = data.name;
		this.type                  = data.type;
		this.position              = data.position;
		this.permission_overwrites = data.permission_overwrites; // todo
	}
}

module.exports = ServerChannel;
