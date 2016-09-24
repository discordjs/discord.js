const EventEmitter = require('events').EventEmitter;
const mergeDefault = require('../util/MergeDefault');
const Constants = require('../util/Constants');
const RESTManager = require('./rest/RESTManager');
const ClientDataManager = require('./ClientDataManager');
const ClientManager = require('./ClientManager');
const ClientDataResolver = require('./ClientDataResolver');
const ClientVoiceManager = require('./voice/ClientVoiceManager');
const WebSocketManager = require('./websocket/WebSocketManager');
const ActionsManager = require('./actions/ActionsManager');
const Collection = require('../util/Collection');

/**
 * The starting point for making a Discord Bot.
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
  /**
   * @param {ClientOptions} [options] Options for the client
   */
  constructor(options) {
    super();

    /**
     * The options the client was instantiated with
     * @type {ClientOptions}
     */
    this.options = mergeDefault(Constants.DefaultOptions, options);

    if (!this.options.shard_id && 'SHARD_ID' in process.env) {
      this.options.shard_id = process.env.SHARD_ID;
    }

    if (!this.options.shard_count && 'SHARD_COUNT' in process.env) {
      this.options.shard_count = process.env.SHARD_COUNT;
    }

    /**
     * The REST manager of the client
     * @type {RESTManager}
     * @private
     */
    this.rest = new RESTManager(this);

    /**
     * The data manager of the Client
     * @type {ClientDataManager}
     * @private
     */
    this.dataManager = new ClientDataManager(this);

    /**
     * The manager of the Client
     * @type {ClientManager}
     * @private
     */
    this.manager = new ClientManager(this);

    /**
     * The WebSocket Manager of the Client
     * @type {WebSocketManager}
     * @private
     */
    this.ws = new WebSocketManager(this);

    /**
     * The Data Resolver of the Client
     * @type {ClientDataResolver}
     * @private
     */
    this.resolver = new ClientDataResolver(this);

    /**
     * The Action Manager of the Client
     * @type {ActionsManager}
     * @private
     */
    this.actions = new ActionsManager(this);

    /**
     * The Voice Manager of the Client
     * @type {ClientVoiceManager}
     * @private
     */
    this.voice = new ClientVoiceManager(this);

    /**
     * A Collection of the Client's stored users
     * @type {Collection<string, User>}
     */
    this.users = new Collection();

    /**
     * A Collection of the Client's stored guilds
     * @type {Collection<string, Guild>}
     */
    this.guilds = new Collection();

    /**
     * A Collection of the Client's stored channels
     * @type {Collection<string, Channel>}
     */
    this.channels = new Collection();

    /**
     * The authorization token for the logged in user/bot.
     * @type {?string}
     */
    this.token = null;

    /**
     * The email, if there is one, for the logged in Client
     * @type {?string}
     */
    this.email = null;

    /**
     * The password, if there is one, for the logged in Client
     * @type {?string}
     */
    this.password = null;

    /**
     * The ClientUser representing the logged in Client
     * @type {?ClientUser}
     */
    this.user = null;

    /**
     * The date at which the Client was regarded as being in the `READY` state.
     * @type {?Date}
     */
    this.readyTime = null;

    this._timeouts = new Set();
    this._intervals = new Set();

    if (this.options.message_sweep_interval > 0) {
      this.setInterval(this.sweepMessages.bind(this), this.options.message_sweep_interval * 1000);
    }

    if (process.send) {
      process.on('message', message => {
        if (!message) return;
        if (message._eval) {
          try {
            process.send({ _evalResult: eval(message._eval) });
          } catch (err) {
            process.send({ _evalError: err });
          }
        } else if (message._fetchProp) {
          const props = message._fetchProp.split('.');
          let value = this; // eslint-disable-line consistent-this
          for (const prop of props) value = value[prop];
          process.send({ _fetchProp: message._fetchProp, _fetchPropValue: value });
        }
      });
    }
  }

  /**
   * The status for the logged in Client.
   * @readonly
   * @type {?number}
   */
  get status() {
    return this.ws.status;
  }

  /**
   * The uptime for the logged in Client.
   * @readonly
   * @type {?number}
   */
  get uptime() {
    return this.readyTime ? Date.now() - this.readyTime : null;
  }

  /**
   * Returns a Collection, mapping Guild ID to Voice Connections.
   * @readonly
   * @type {Collection<string, VoiceConnection>}
   */
  get voiceConnections() {
    return this.voice.connections;
  }

  /**
   * The emojis that the client can use. Mapped by emoji ID.
   * @type {Collection<string, Emoji>}
   * @readonly
   */
  get emojis() {
    const emojis = new Collection();
    this.guilds.map(g => g.emojis.map(e => emojis.set(e.id, e)));
    return emojis;
  }

  /**
   * Logs the client in. If successful, resolves with the account's token. <warn>If you're making a bot, it's
   * much better to use a bot account rather than a user account.
   * Bot accounts have higher rate limits and have access to some features user accounts don't have. User bots
   * that are making a lot of API requests can even be banned.</warn>
   * @param  {string} tokenOrEmail The token or email used for the account. If it is an email, a password _must_ be
   * provided.
   * @param  {string} [password] The password for the account, only needed if an email was provided.
   * @returns {Promise<string>}
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
  login(tokenOrEmail, password = null) {
    if (password) return this.rest.methods.loginEmailPassword(tokenOrEmail, password);
    return this.rest.methods.loginToken(tokenOrEmail);
  }

  /**
   * Destroys the client and logs out.
   * @returns {Promise}
   */
  destroy() {
    return new Promise((resolve, reject) => {
      this.manager.destroy().then(() => {
        for (const t of this._timeouts) clearTimeout(t);
        for (const i of this._intervals) clearInterval(i);
        this._timeouts = [];
        this._intervals = [];
        this.token = null;
        this.email = null;
        this.password = null;
        resolve();
      }).catch(reject);
    });
  }

  /**
   * This shouldn't really be necessary to most developers as it is automatically invoked every 30 seconds, however
   * if you wish to force a sync of Guild data, you can use this. Only applicable to user accounts.
   * @param {Guild[]} [guilds=this.guilds.array()] An array of guilds to sync
   */
  syncGuilds(guilds = this.guilds.array()) {
    if (!this.user.bot) {
      this.ws.send({
        op: 12,
        d: guilds.map(g => g.id),
      });
    }
  }

  /**
   * Caches a user, or obtains it from the cache if it's already cached.
   * If the user isn't already cached, it will only be obtainable by OAuth bot accounts.
   * @param {string} id The ID of the user to obtain
   * @returns {Promise<User>}
   */
  fetchUser(id) {
    if (this.users.has(id)) return Promise.resolve(this.users.get(id));
    return this.rest.methods.getUser(id);
  }

  /**
   * Fetches an invite object from an invite code.
   * @param {string} code the invite code.
   * @returns {Promise<Invite>}
   */
  fetchInvite(code) {
    return this.rest.methods.getInvite(code);
  }

  /**
   * Sweeps all channels' messages and removes the ones older than the max message lifetime.
   * If the message has been edited, the time of the edit is used rather than the time of the original message.
   * @param {number} [lifetime=this.options.message_cache_lifetime] Messages that are older than this (in seconds)
   * will be removed from the caches. The default is based on the client's `message_cache_lifetime` option.
   * @returns {number} Amount of messages that were removed from the caches,
   * or -1 if the message cache lifetime is unlimited
   */
  sweepMessages(lifetime = this.options.message_cache_lifetime) {
    if (typeof lifetime !== 'number' || isNaN(lifetime)) throw new TypeError('Lifetime must be a number.');
    if (lifetime <= 0) {
      this.emit('debug', 'Didn\'t sweep messages - lifetime is unlimited');
      return -1;
    }

    const lifetimeMs = lifetime * 1000;
    const now = Date.now();
    let channels = 0;
    let messages = 0;

    for (const channel of this.channels.values()) {
      if (!channel.messages) continue;
      channels++;

      for (const message of channel.messages.values()) {
        if (now - (message._editedTimestamp || message._timestamp) > lifetimeMs) {
          channel.messages.delete(message.id);
          messages++;
        }
      }
    }

    this.emit('debug', `Swept ${messages} messages older than ${lifetime} seconds in ${channels} text-based channels`);
    return messages;
  }

  setTimeout(fn, ...params) {
    const timeout = setTimeout(() => {
      fn();
      this._timeouts.delete(timeout);
    }, ...params);
    this._timeouts.add(timeout);
    return timeout;
  }

  clearTimeout(timeout) {
    clearTimeout(timeout);
    this._timeouts.delete(timeout);
  }

  setInterval(...params) {
    const interval = setInterval(...params);
    this._intervals.add(interval);
    return interval;
  }

  clearInterval(interval) {
    clearInterval(interval);
    this._intervals.delete(interval);
  }
}

module.exports = Client;

/**
 * Emitted for general warnings
 * @event Client#warn
 * @param {string} The warning
 */

/**
 * Emitted for general debugging information
 * @event Client#debug
 * @param {string} The debug information
 */
