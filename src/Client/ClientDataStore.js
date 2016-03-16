const Constants = require('../util/Constants');
const DataStore = require('../util/DataStore');

class ClientDataStore extends DataStore{
	constructor(client) {
		super();
		this.client = client;
		this._users = {};
		this._servers = {};
	}

	get users() {
		return Object.values(this._users);
	}

	get servers() {
		return Object.values(this._servers);
	}
}

module.exports = ClientDataStore;
