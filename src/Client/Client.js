const Constants        = require('../util/Constants'),
      ClientAPIManager = require('./API/ClientAPI'),
      ClientManager    = require('./ClientManager'),
      ClientWebSocket  = require('./WebSocket/ClientWebSocket'),
      ClientLogger     = require('./ClientLogger'),
      ClientDataStore  = require('./ClientDataStore'),
      EventEmitter     = require('events').EventEmitter,
      MergeDefault     = require('../util/MergeDefault');

class Client extends EventEmitter {
	constructor(options) {
		super();
		this.options   = MergeDefault(Constants.DefaultOptions, options);
		this.manager   = new ClientManager(this);
		this.api       = new ClientAPIManager(this);
		this.websocket = null;
		this.logger    = new ClientLogger(this);
		this.store     = new ClientDataStore(this);
		this.user      = null;
	}

	get token() {
		return this.api.token;
	}

	get users() {
		return this.store.users;
	}

	get servers() {
		return this.store.servers;
	}

	async login(email, password) {
		return this.api.login(email, password).then(
			token => this.manager.registerTokenAndConnect(token)
		);
	}
}

module.exports = Client;
