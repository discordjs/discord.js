const EventEmitter = require('events');
const Constants = require('../util/Constants');
const Permissions = require('../util/Permissions');
const Util = require('../util/Util');
const RESTManager = require('./rest/RESTManager');
const ClientManager = require('./ClientManager');
const ClientDataResolver = require('./ClientDataResolver');
const ClientVoiceManager = require('./voice/ClientVoiceManager');
const WebSocketManager = require('./websocket/WebSocketManager');
const ActionsManager = require('./actions/ActionsManager');
const Collection = require('../util/Collection');
const VoiceRegion = require('../structures/VoiceRegion');
const Webhook = require('../structures/Webhook');
const Invite = require('../structures/Invite');
const ClientApplication = require('../structures/ClientApplication');
const ShardClientUtil = require('../sharding/ShardClientUtil');
const VoiceBroadcast = require('./voice/VoiceBroadcast');
const UserStore = require('../stores/UserStore');
const ChannelStore = require('../stores/ChannelStore');
const GuildStore = require('../stores/GuildStore');
const ClientPresenceStore = require('../stores/ClientPresenceStore');
const { Error, TypeError, RangeError } = require('../errors');

/**
 * The main hub for interacting with the Discord API, and the starting point for any bot.
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
    this.options = Util.mergeDefault(Constants.DefaultOptions, options);
    this._validateOptions();

    /**
     * The REST manager of the client
     * @type {RESTManager}
     * @private
     */
    this.rest = new RESTManager(this);

    /**
     * The manager of the client
     * @type {ClientManager}
     * @private
     */
    this.manager = new ClientManager(this);

    /**
     * The WebSocket manager of the client
     * @type {WebSocketManager}
     * @private
     */
    this.ws = new WebSocketManager(this);

    /**
     * The data resolver of the client
     * @type {ClientDataResolver}
     * @private
     */
    this.resolver = new ClientDataResolver(this);

    /**
     * The action manager of the client
     * @type {ActionsManager}
     * @private
     */
    this.actions = new ActionsManager(this);

    /**
     * The voice manager of the client (`null` in browsers)
     * @type {?ClientVoiceManager}
     * @private
     */
    this.voice = !this.browser ? new ClientVoiceManager(this) : null;

    /**
     * The shard helpers for the client
     * (only if the process was spawned as a child, such as from a {@link ShardingManager})
     * @type {?ShardClientUtil}
     */
    this.shard = process.send ? ShardClientUtil.singleton(this) : null;

    /**
     * All of the {@link User} objects that have been cached at any point, mapped by their IDs
     * @type {UserStore<Snowflake, User>}
     */
    this.users = new UserStore(this);

    /**
     * All of the guilds the client is currently handling, mapped by their IDs -
     * as long as sharding isn't being used, this will be *every* guild the bot is a member of
     * @type {GuildStore<Snowflake, Guild>}
     */
    this.guilds = new GuildStore(this);

    /**
     * All of the {@link Channel}s that the client is currently handling, mapped by their IDs -
     * as long as sharding isn't being used, this will be *every* channel in *every* guild, and all DM channels
     * @type {ChannelStore<Snowflake, Channel>}
     */
    this.channels = new ChannelStore(this);

    /**
     * Presences that have been received for the client user's friends, mapped by user IDs
     * <warn>This is only filled when using a user account.</warn>
     * @type {ClientPresenceStore<Snowflake, Presence>}
     */
    this.presences = new ClientPresenceStore(this);

    Object.defineProperty(this, 'token', { writable: true });
    if (!this.token && 'CLIENT_TOKEN' in process.env) {
      /**
       * Authorization token for the logged in user/bot
       * <warn>This should be kept private at all times.</warn>
       * @type {?string}
       */
      this.token = process.env.CLIENT_TOKEN;
    } else {
      this.token = null;
    }

    /**
     * User that the client is logged in as
     * @type {?ClientUser}
     */
    this.user = null;

    /**
     * Time at which the client was last regarded as being in the `READY` state
     * (each time the client disconnects and successfully reconnects, this will be overwritten)
     * @type {?Date}
     */
    this.readyAt = null;

    /**
     * Active voice broadcasts that have been created
     * @type {VoiceBroadcast[]}
     */
    this.broadcasts = [];

    /**
     * Previous heartbeat pings of the websocket (most recent first, limited to three elements)
     * @type {number[]}
     */
    this.pings = [];

    /**
     * Timeouts set by {@link Client#setTimeout} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._timeouts = new Set();

    /**
     * Intervals set by {@link Client#setInterval} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._intervals = new Set();

    if (this.options.messageSweepInterval > 0) {
      this.setInterval(this.sweepMessages.bind(this), this.options.messageSweepInterval * 1000);
    }
  }

  /**
   * Timestamp of the latest ping's start time
   * @type {number}
   * @private
   */
  get _pingTimestamp() {
    return this.ws.connection ? this.ws.connection.lastPingTimestamp : 0;
  }

  /**
   * API shortcut
   * @type {Object}
   * @private
   */
  get api() {
    return this.rest.api;
  }

  /**
   * Current status of the client's connection to Discord
   * @type {?Status}
   * @readonly
   */
  get status() {
    return this.ws.connection ? this.ws.connection.status : null;
  }

  /**
   * How long it has been since the client last entered the `READY` state
   * @type {?number}
   * @readonly
   */
  get uptime() {
    return this.readyAt ? Date.now() - this.readyAt : null;
  }

  /**
   * Average heartbeat ping of the websocket, obtained by averaging the {@link Client#pings} property
   * @type {number}
   * @readonly
   */
  get ping() {
    return this.pings.reduce((prev, p) => prev + p, 0) / this.pings.length;
  }

  /**
   * All active voice connections that have been established, mapped by guild ID
   * @type {Collection<Snowflake, VoiceConnection>}
   * @readonly
   */
  get voiceConnections() {
    if (this.browser) return new Collection();
    return this.voice.connections;
  }

  /**
   * All custom emojis that the client has access to, mapped by their IDs
   * @type {Collection<Snowflake, Emoji>}
   * @readonly
   */
  get emojis() {
    const emojis = new Collection();
    for (const guild of this.guilds.values()) {
      if (guild.available) for (const emoji of guild.emojis.values()) emojis.set(emoji.id, emoji);
    }
    return emojis;
  }

  /**
   * Timestamp of the time the client was last `READY` at
   * @type {?number}
   * @readonly
   */
  get readyTimestamp() {
    return this.readyAt ? this.readyAt.getTime() : null;
  }

  /**
   * Whether the client is in a browser environment
   * @type {boolean}
   * @readonly
   */
  get browser() {
    return typeof window !== 'undefined';
  }

  /**
   * Creates a voice broadcast.
   * @returns {VoiceBroadcast}
   */
  createVoiceBroadcast() {
    const broadcast = new VoiceBroadcast(this);
    this.broadcasts.push(broadcast);
    return broadcast;
  }

  /**
   * Logs the client in, establishing a websocket connection to Discord.
   * <info>Both bot and regular user accounts are supported, but it is highly recommended to use a bot account whenever
   * possible. User accounts are subject to harsher ratelimits and other restrictions that don't apply to bot accounts.
   * Bot accounts also have access to many features that user accounts cannot utilise. User accounts that are found to
   * be abusing/overusing the API will be banned, locking you out of Discord entirely.</info>
   * @param {string} token Token of the account to log in with
   * @returns {Promise<string>} Token of the account used
   * @example
   * client.login('my token');
   */
  login(token) {
    return new Promise((resolve, reject) => {
      if (typeof token !== 'string') throw new Error('TOKEN_INVALID');
      token = token.replace(/^Bot\s*/i, '');
      this.manager.connectToWebSocket(token, resolve, reject);
    }).catch(e => {
      this.destroy();
      return Promise.reject(e);
    });
  }

  /**
   * Logs out, terminates the connection to Discord, and destroys the client.
   * @returns {Promise}
   */
  destroy() {
    for (const t of this._timeouts) clearTimeout(t);
    for (const i of this._intervals) clearInterval(i);
    this._timeouts.clear();
    this._intervals.clear();
    return this.manager.destroy();
  }

  /**
   * Requests a sync of guild data with Discord.
   * <info>This can be done automatically every 30 seconds by enabling {@link ClientOptions#sync}.</info>
   * <warn>This is only available when using a user account.</warn>
   * @param {Guild[]|Collection<Snowflake, Guild>} [guilds=this.guilds] An array or collection of guilds to sync
   */
  syncGuilds(guilds = this.guilds) {
    if (this.user.bot) return;
    this.ws.send({
      op: 12,
      d: guilds instanceof Collection ? guilds.keyArray() : guilds.map(g => g.id),
    });
  }

  /**
   * Obtains an invite from Discord.
   * @param {InviteResolvable} invite Invite code or URL
   * @returns {Promise<Invite>}
   */
  fetchInvite(invite) {
    const code = this.resolver.resolveInviteCode(invite);
    return this.api.invites(code).get({ query: { with_counts: true } })
      .then(data => new Invite(this, data));
  }

  /**
   * Obtains a webhook from Discord.
   * @param {Snowflake} id ID of the webhook
   * @param {string} [token] Token for the webhook
   * @returns {Promise<Webhook>}
   */
  fetchWebhook(id, token) {
    return this.api.webhooks(id, token).get().then(data => new Webhook(this, data));
  }

  /**
   * Obtains the available voice regions from Discord.
   * @returns {Collection<string, VoiceRegion>}
   */
  fetchVoiceRegions() {
    return this.api.voice.regions.get().then(res => {
      const regions = new Collection();
      for (const region of res) regions.set(region.id, new VoiceRegion(region));
      return regions;
    });
  }

  /**
   * Sweeps all text-based channels' messages and removes the ones older than the max message lifetime.
   * If the message has been edited, the time of the edit is used rather than the time of the original message.
   * @param {number} [lifetime=this.options.messageCacheLifetime] Messages that are older than this (in seconds)
   * will be removed from the caches. The default is based on {@link ClientOptions#messageCacheLifetime}
   * @returns {number} Amount of messages that were removed from the caches,
   * or -1 if the message cache lifetime is unlimited
   */
  sweepMessages(lifetime = this.options.messageCacheLifetime) {
    if (typeof lifetime !== 'number' || isNaN(lifetime)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'Lifetime', 'a number');
    }
    if (lifetime <= 0) {
      this.emit(Constants.Events.DEBUG, 'Didn\'t sweep messages - lifetime is unlimited');
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

    this.emit(Constants.Events.DEBUG,
      `Swept ${messages} messages older than ${lifetime} seconds in ${channels} text-based channels`);
    return messages;
  }

  /**
   * Obtains the OAuth Application of the bot from Discord.
   * @param {Snowflake} [id='@me'] ID of application to fetch
   * @returns {Promise<ClientApplication>}
   */
  fetchApplication(id = '@me') {
    return this.api.oauth2.applications(id).get()
      .then(app => new ClientApplication(this, app));
  }

  /**
   * Generates a link that can be used to invite the bot to a guild.
   * <warn>This is only available when using a bot account.</warn>
   * @param {PermissionResolvable[]|number} [permissions] Permissions to request
   * @returns {Promise<string>}
   * @example
   * client.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
   *   .then(link => {
   *     console.log(`Generated bot invite link: ${link}`);
   *   });
   */
  generateInvite(permissions) {
    if (permissions) {
      if (permissions instanceof Array) permissions = Permissions.resolve(permissions);
    } else {
      permissions = 0;
    }
    return this.fetchApplication().then(application =>
      `https://discordapp.com/oauth2/authorize?client_id=${application.id}&permissions=${permissions}&scope=bot`
    );
  }

  /**
   * Sets a timeout that will be automatically cancelled if the client is destroyed.
   * @param {Function} fn Function to execute
   * @param {number} delay Time to wait before executing (in milliseconds)
   * @param {...*} args Arguments for the function
   * @returns {Timeout}
   */
  setTimeout(fn, delay, ...args) {
    const timeout = setTimeout(() => {
      fn(...args);
      this._timeouts.delete(timeout);
    }, delay);
    this._timeouts.add(timeout);
    return timeout;
  }

  /**
   * Clears a timeout.
   * @param {Timeout} timeout Timeout to cancel
   */
  clearTimeout(timeout) {
    clearTimeout(timeout);
    this._timeouts.delete(timeout);
  }

  /**
   * Sets an interval that will be automatically cancelled if the client is destroyed.
   * @param {Function} fn Function to execute
   * @param {number} delay Time to wait before executing (in milliseconds)
   * @param {...*} args Arguments for the function
   * @returns {Timeout}
   */
  setInterval(fn, delay, ...args) {
    const interval = setInterval(fn, delay, ...args);
    this._intervals.add(interval);
    return interval;
  }

  /**
   * Clears an interval.
   * @param {Timeout} interval Interval to cancel
   */
  clearInterval(interval) {
    clearInterval(interval);
    this._intervals.delete(interval);
  }

  /**
   * Adds a ping to {@link Client#pings}.
   * @param {number} startTime Starting time of the ping
   * @private
   */
  _pong(startTime) {
    this.pings.unshift(Date.now() - startTime);
    if (this.pings.length > 3) this.pings.length = 3;
    this.ws.lastHeartbeatAck = true;
  }

  /**
   * Calls {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval} on a script
   * with the client as `this`.
   * @param {string} script Script to eval
   * @returns {*}
   * @private
   */
  _eval(script) {
    return eval(script);
  }

  /**
   * Validates the client options.
   * @param {ClientOptions} [options=this.options] Options to validate
   * @private
   */
  _validateOptions(options = this.options) {
    if (typeof options.shardCount !== 'number' || isNaN(options.shardCount)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'shardCount', 'a number');
    }
    if (typeof options.shardId !== 'number' || isNaN(options.shardId)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'shardId', 'a number');
    }
    if (options.shardCount < 0) throw new RangeError('CLIENT_INVALID_OPTION', 'shardCount', 'at least 0');
    if (options.shardId < 0) throw new RangeError('CLIENT_INVALID_OPTION', 'shardId', 'at least 0');
    if (options.shardId !== 0 && options.shardId >= options.shardCount) {
      throw new RangeError('CLIENT_INVALID_OPTION', 'shardId', 'less than shardCount');
    }
    if (typeof options.messageCacheMaxSize !== 'number' || isNaN(options.messageCacheMaxSize)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'messageCacheMaxSize', 'a number');
    }
    if (typeof options.messageCacheLifetime !== 'number' || isNaN(options.messageCacheLifetime)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'The messageCacheLifetime', 'a number');
    }
    if (typeof options.messageSweepInterval !== 'number' || isNaN(options.messageSweepInterval)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'messageSweepInterval', 'a number');
    }
    if (typeof options.fetchAllMembers !== 'boolean') {
      throw new TypeError('CLIENT_INVALID_OPTION', 'fetchAllMembers', 'a boolean');
    }
    if (typeof options.disableEveryone !== 'boolean') {
      throw new TypeError('CLIENT_INVALID_OPTION', 'disableEveryone', 'a boolean');
    }
    if (typeof options.restWsBridgeTimeout !== 'number' || isNaN(options.restWsBridgeTimeout)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'restWsBridgeTimeout', 'a number');
    }
    if (typeof options.internalSharding !== 'boolean') {
      throw new TypeError('CLIENT_INVALID_OPTION', 'internalSharding', 'a boolean');
    }
    if (!(options.disabledEvents instanceof Array)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'disabledEvents', 'an Array');
    }
  }
}

module.exports = Client;

/**
 * Emitted for general warnings.
 * @event Client#warn
 * @param {string} info The warning
 */

/**
 * Emitted for general debugging information.
 * @event Client#debug
 * @param {string} info The debug information
 */
