const AbstractDataStore = require('./AbstractDataStore');

class ClientDataStore extends AbstractDataStore {
	constructor(client) {
		super();

		this.client = client;
		this.addProperty('users');
		this.addProperty('servers');
	}

	get users() {
		return this.getAll('users');
	}

	get servers() {
		return this.getAll('servers');
	}
}

module.exports = ClientDataStore;
