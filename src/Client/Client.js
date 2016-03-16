const Constants = require('../util/Constants');
const ClientAPIManager = require('./API/ClientAPI');
const ClientManager = require('./ClientManager');
const ClientWebSocket = require('./WebSocket/ClientWebSocket');
const ClientLogger = require('./ClientLogger');
const ClientDataStore = require('./ClientDataStore');
const EventEmitter = require('events').EventEmitter;
const MergeDefault = require('../util/MergeDefault');

class Client extends EventEmitter{
	constructor(options) {
		super();
		this.options = MergeDefault(Constants.DefaultOptions, options);
		this.manager = new ClientManager(this);
		this.api = new ClientAPIManager(this);
		this.websocket = null;
		this.logger = new ClientLogger(this);
		this.store = new ClientDataStore(this);
		this.user = null;
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
