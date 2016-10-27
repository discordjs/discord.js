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
const Presence = require('../structures/Presence').Presence;
const ShardClientUtil = require('../sharding/ShardClientUtil');

/**
 * The starting point for making a Discord Bot.
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
  /**
   * @param {ClientOptions} [options] Options for the client
   */
  constructor(options = {}) {
    super();

    // Obtain shard details from environment
    if (!options.shardId && 'SHARD_ID' in process.env) options.shardId = Number(process.env.SHARD_ID);
    if (!options.shardCount && 'SHARD_COUNT' in process.env) options.shardCount = Number(process.env.SHARD_COUNT);

    /**
     * The options the client was instantiated with
     * @type {ClientOptions}
     */
    this.options = mergeDefault(Constants.DefaultOptions, options);
    this._validateOptions();

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
     * The shard helpers for the client (only if the process was spawned as a child, such as from a ShardingManager)
     * @type {?ShardUtil}
     */
    this.shard = process.send ? ShardClientUtil.singleton(this) : null;

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
     * A Collection of presences for friends of the logged in user.
     * <warn>This is only present for user accounts, not bot accounts!</warn>
     * @type {Collection<string, Presence>}
     */
    this.presences = new Collection();

    if (!this.token && 'CLIENT_TOKEN' in process.env) {
      /**
       * The authorization token for the logged in user/bot.
       * @type {?string}
       */
      this.token = process.env.CLIENT_TOKEN;
    } else {
      this.token = null;
    }

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
    this.readyAt = null;

    this._timeouts = new Set();
    this._intervals = new Set();

    if (this.options.messageSweepInterval > 0) {
      this.setInterval(this.sweepMessages.bind(this), this.options.messageSweepInterval * 1000);
    }
  }

  /**
   * The status for the logged in Client.
   * @type {?number}
   * @readonly
   */
  get status() {
    return this.ws.status;
  }

  /**
   * The uptime for the logged in Client.
   * @type {?number}
   * @readonly
   */
  get uptime() {
    return this.readyAt ? Date.now() - this.readyAt : null;
  }

  /**
   * Returns a Collection, mapping Guild ID to Voice Connections.
   * @type {Collection<string, VoiceConnection>}
   * @readonly
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
    for (const guild of this.guilds.values()) {
      for (const emoji of guild.emojis.values()) emojis.set(emoji.id, emoji);
    }
    return emojis;
  }

  /**
   * The timestamp that the client was last ready at
   * @type {?number}
   * @readonly
   */
  get readyTimestamp() {
    return this.readyAt ? this.readyAt.getTime() : null;
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
    for (const t of this._timeouts) clearTimeout(t);
    for (const i of this._intervals) clearInterval(i);
    this._timeouts.clear();
    this._intervals.clear();
    this.token = null;
    this.email = null;
    this.password = null;
    return this.manager.destroy();
  }

  /**
   * This shouldn't really be necessary to most developers as it is automatically invoked every 30 seconds, however
   * if you wish to force a sync of Guild data, you can use this. Only applicable to user accounts.
   * @param {Guild[]|Collection<string, Guild>} [guilds=this.guilds] An array or collection of guilds to sync
   */
  syncGuilds(guilds = this.guilds) {
    if (!this.user.bot) {
      this.ws.send({
        op: 12,
        d: guilds instanceof Collection ? guilds.keyArray() : guilds.map(g => g.id),
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
   * @param {InviteResolvable} invite An invite code or URL
   * @returns {Promise<Invite>}
   */
  fetchInvite(invite) {
    const code = this.resolver.resolveInviteCode(invite);
    return this.rest.methods.getInvite(code);
  }

  /**
   * Fetch a webhook by ID.
   * @param {string} id ID of the webhook
   * @returns {Promise<Webhook>}
   */
  fetchWebhook(id) {
    return this.rest.methods.getWebhook(id);
  }

  /**
   * Sweeps all channels' messages and removes the ones older than the max message lifetime.
   * If the message has been edited, the time of the edit is used rather than the time of the original message.
   * @param {number} [lifetime=this.options.messageCacheLifetime] Messages that are older than this (in seconds)
   * will be removed from the caches. The default is based on the client's `messageCacheLifetime` option.
   * @returns {number} Amount of messages that were removed from the caches,
   * or -1 if the message cache lifetime is unlimited
   */
  sweepMessages(lifetime = this.options.messageCacheLifetime) {
    if (typeof lifetime !== 'number' || isNaN(lifetime)) throw new TypeError('The lifetime must be a number.');
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
        if (now - (message.editedTimestamp || message.createdTimestamp) > lifetimeMs) {
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

  _setPresence(id, presence) {
    if (this.presences.get(id)) {
      this.presences.get(id).update(presence);
      return;
    }
    this.presences.set(id, new Presence(presence));
  }

  _eval(script) {
    return eval(script);
  }

  _validateOptions(options = this.options) {
    if (typeof options.shardCount !== 'number' || isNaN(options.shardCount)) {
      throw new TypeError('The shardCount option must be a number.');
    }
    if (typeof options.shardId !== 'number' || isNaN(options.shardId)) {
      throw new TypeError('The shardId option must be a number.');
    }
    if (options.shardCount < 0) throw new RangeError('The shardCount option must be at least 0.');
    if (options.shardId < 0) throw new RangeError('The shardId option must be at least 0.');
    if (options.shardId !== 0 && options.shardId >= options.shardCount) {
      throw new RangeError('The shardId option must be less than shardCount.');
    }
    if (typeof options.messageCacheMaxSize !== 'number' || isNaN(options.messageCacheMaxSize)) {
      throw new TypeError('The messageCacheMaxSize option must be a number.');
    }
    if (typeof options.messageCacheLifetime !== 'number' || isNaN(options.messageCacheLifetime)) {
      throw new TypeError('The messageCacheLifetime option must be a number.');
    }
    if (typeof options.messageSweepInterval !== 'number' || isNaN(options.messageSweepInterval)) {
      throw new TypeError('The messageSweepInterval option must be a number.');
    }
    if (typeof options.fetchAllMembers !== 'boolean') {
      throw new TypeError('The fetchAllMembers option must be a boolean.');
    }
    if (typeof options.disableEveryone !== 'boolean') {
      throw new TypeError('The disableEveryone option must be a boolean.');
    }
    if (typeof options.restWsBridgeTimeout !== 'number' || isNaN(options.restWsBridgeTimeout)) {
      throw new TypeError('The restWsBridgeTimeout option must be a number.');
    }
    if (!(options.disabledEvents instanceof Array)) throw new TypeError('The disabledEvents option must be an Array.');
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
