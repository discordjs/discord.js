class Role {
	constructor(client, data) {
		this.client = client;
		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		for (let prop in data) {
			if (data.hasOwnProperty(prop)) {
				this[prop] = data[prop] || this[prop];
			}
		}
	}
}

module.exports = Role;
