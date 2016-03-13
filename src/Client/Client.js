const Constants = require("../util/Constants");
const ClientAPIManager = require("./API/ClientAPI");
const ClientManager = require("./ClientManager");
const ClientWebSocket = require("./WebSocket/ClientWebSocket");
const ClientLogger = require("./ClientLogger");
const EventEmitter = require("events").EventEmitter;
const MergeDefault = require("../util/MergeDefault");

class Client extends EventEmitter{
	constructor(options) {
		super();
		this.options = MergeDefault(Constants.DefaultOptions, options);
		this.manager = new ClientManager(this);
		this.api = new ClientAPIManager(this);
		this.websocket = null;
		this.logger = new ClientLogger(this);
	}

	get token() {
		return this.api.token;
	}

	async login(email, password) {
		return this.api.login(email, password).then(
			token => this.manager.registerTokenAndConnect(token)
		);
	}
}

module.exports = Client;