'use strict';

const EventEmitter = require('events').EventEmitter;
const MergeDefault = require('../util/MergeDefault');
const Constants = require('../util/Constants');
const RESTManager = require('./rest/RestManager');
const ClientDataStore = require('../structures/DataStore/ClientDataStore');
const ClientManager = require('./ClientManager');
const ClientDataResolver = require('./ClientDataResolver');
const WebSocketManager = require('./websocket/WebSocketManager');

class Client extends EventEmitter{

	constructor(options) {
		super();
		this.options = MergeDefault(Constants.DefaultOptions, options);
		this.rest = new RESTManager(this);
		this.store = new ClientDataStore(this);
		this.manager = new ClientManager(this);
		this.ws = new WebSocketManager(this);
		this.resolver = new ClientDataResolver(this);
	}

	login(email, password) {
		if (password) {
			// login with email and password
			return this.rest.methods.LoginEmailPassword(email, password);
		} else {
			// login with token
			return this.rest.methods.LoginToken(email);
		}
	}

}

module.exports = Client;
