const Constants = require("../util/Constants");
const ClientAPIManager = require("./API/ClientAPI");
const ClientManager = require("./ClientManager");
const ClientWebSocket = require("./ClientWebSocket");
const EventEmitter = require("events").EventEmitter;

class Client extends EventEmitter{
	constructor(options) {
		super();
		this.manager = new ClientManager(this);
		this.api = new ClientAPIManager(this);
		this.websocket = null;
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