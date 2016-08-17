const EventEmitter = require('events').EventEmitter;
const mergeDefault = require('../util/MergeDefault');
const Constants = require('../util/Constants');
const RESTManager = require('./rest/RESTManager');
const ClientDataStore = require('../structures/datastore/ClientDataStore');
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
class Client extends EventEmitter {

  constructor(options) {
    super();
    this.options = mergeDefault(Constants.DefaultOptions, options);
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
   * // log the client in using a token
   * const token = 'my token';
   * client.login(token);
   * @example
   * // log the client in using email and password
   * const email = 'user@email.com';
   * const password = 'supersecret123';
   * client.login(email, password);
   */
  login(email, password) {
    if (password) {
      // login with email and password
      return this.rest.methods.loginEmailPassword(email, password);
    }
    // login with token
    return this.rest.methods.loginToken(email);
  }

  /**
   * The User of the logged in Client, only available after `READY` has been fired.
   * @type {ClientUser}
   */
  get user() {
    return this.store.user;
  }

}

module.exports = Client;
