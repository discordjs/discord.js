const AbstractDataStore = require('./AbstractDataStore');

class ServerDataStore extends AbstractDataStore {
	constructor() {
		super();

		this.addProperty('members');
		this.addProperty('channels');
		this.addProperty('roles');
	}

	get members() {
		return this.getAll('members');
	}

	get channels() {
		return this.getAll('channels');
	}

	get roles() {
		return this.getAll('roles');
	}
}

module.exports = ServerDataStore;
