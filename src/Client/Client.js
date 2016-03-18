const Constants        = require('../util/Constants'),
      ClientAPIManager = require('./API/ClientAPI'),
      ClientManager    = require('./ClientManager'),
      ClientLogger     = require('./ClientLogger'),
      ClientDataStore  = require('../DataStore/ClientDataStore'),
      EventEmitter     = require('events').EventEmitter,
      MergeDefault     = require('../util/MergeDefault');

class Client extends EventEmitter {
	/**
	 * * @param {Array} options
	 */
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

	/**
	 * Returns the token received from the API authentication
	 *
	 * @returns {String} Returns the bot's token
	 */
	get token() {
		return this.api.token;
	}

	/**
	 * Returns all of the users inside the datastore
	 *
	 * @returns {ClientUser[]} Returns an array of User objects
	 */
	get users() {
		return this.store.users;
	}

	/**
	 * Returns all of the servers inside the datastore
	 *
	 * @returns {Server[]} Returns an array of Server objects
	 */
	get servers() {
		return this.store.servers;
	}

	/**
	 * Fetches a server by the server identifier
	 *
	 * @param {String} id
	 *
	 * @returns {Server} Returns a Server
	 */
	getServerById(id) {
		return this.servers.find(server => server.id === id);
	}

	/**
	 * Fetches servers by their name
	 *
	 * @param {String} name
	 *
	 * @returns {Server[]} Returns an array of Servers
	 */
	getServersByName(name) {
		return this.servers.filter(server => server.name === name);
	}

	/**
	 * Fetches a user by the user identifier
	 *
	 * @param {String} id
	 *
	 * @returns {ClientUser} Returns a User
	 */
	getUserById(id) {
		return this.users.find(user => user.id === id);
	}

	/**
	 * Fetches users by their name
	 *
	 * @param {String} name
	 *
	 * @returns {ClientUser[]} Returns an array of ClientUsers
	 */
	getUsersByName(name) {
		return this.users.filter(user => user.name === name);
	}

	/**
	 * Logs in in with either an email and a password, or a token.
	 *
	 * If only one argument is passed, assume its a token.
	 *
	 * @param {String} email|token
	 * @param {String} password
	 *
	 * @returns {Promise}
	 */
	login(email, password) {
		return new Promise((resolve, reject) => {
			this.api.login(email, password)
				.then(token => this.manager.registerTokenAndConnect(token).then(resolve).catch(reject))
				.catch(reject);
		});
	}
}

module.exports = Client;
