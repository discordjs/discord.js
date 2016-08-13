'use strict';

const EventEmitter = require('events').EventEmitter;
const MergeDefault = require('../util/MergeDefault');
const Constants = require('../util/Constants');
const RESTManager = require('./rest/RestManager');
const ClientDataStore = require('../structures/DataStore/ClientDataStore');
const ClientManager = require('./ClientManager');
const ClientDataResolver = require('./ClientDataResolver');
const WebSocketManager = require('./websocket/WebSocketManager');
const ActionsManager = require('./actions/ActionsManager');

/**
 * Creates a new Discord Client
 * ```js
 * const Discord = require("discord.js");
 * const client = new Discord.Client();
 * ```
 */
class Client extends EventEmitter{

	constructor(options) {
		super();
		this.options = MergeDefault(Constants.DefaultOptions, options);
		this.rest = new RESTManager(this);
		this.store = new ClientDataStore(this);
		this.manager = new ClientManager(this);
		this.ws = new WebSocketManager(this);
		this.resolver = new ClientDataResolver(this);
		this.actions = new ActionsManager(this);
	}

	/**
	 * Logs the client in. If successful, resolves with the account's token.
	 * @param  {string} emailOrToken The email or token used for the account. If it is an email, a password _must_ be
	 * provided.
	 * @param  {string} [password] The password for the account, only needed if an email was provided.
	 * @return {Promise<String>}
	 * @example
	 * client.login("token");
	 * // or
	 * client.login("email", "password");
	 */
	login(email, password) {
		if (password) {
			// login with email and password
			return this.rest.methods.LoginEmailPassword(email, password);
		} else {
			// login with token
			return this.rest.methods.LoginToken(email);
		}
	}

	/**
	 * The User of the logged in Client, only available after `READY` has been fired.
	 * @return {ClientUser} [description]
	 */
	get user() {
		return this.store.user;
	}

}

module.exports = Client;
