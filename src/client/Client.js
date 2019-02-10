'use strict';

const BaseClient = require('./BaseClient');
const Permissions = require('../util/Permissions');
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
const GuildEmojiStore = require('../stores/GuildEmojiStore');
const { Events, WSCodes, browser, DefaultOptions } = require('../util/Constants');
const { delayFor } = require('../util/Util');
const DataResolver = require('../util/DataResolver');
const Structures = require('../util/Structures');
const { Error, TypeError, RangeError } = require('../errors');

/**
 * The main hub for interacting with the Discord API, and the starting point for any bot.
 * @extends {BaseClient}
 */
class Client extends BaseClient {
  /**
   * @param {ClientOptions} [options] Options for the client
   */
  constructor(options = {}) {
    super(Object.assign({ _tokenType: 'Bot' }, options));

    // Obtain shard details from environment or if present, worker threads
    let data = process.env;
    try {
      // Test if worker threads module is present and used
      data = require('worker_threads').workerData || data;
    } catch (_) {
      // Do nothing
    }
    if (this.options.shards === DefaultOptions.shards) {
      if ('SHARDS' in data) {
        this.options.shards = JSON.parse(data.SHARDS);
      }
    }
    if (this.options.totalShardCount === DefaultOptions.totalShardCount) {
      if ('TOTAL_SHARD_COUNT' in data) {
        this.options.totalShardCount = Number(data.TOTAL_SHARD_COUNT);
      } else if (Array.isArray(this.options.shards)) {
        this.options.totalShardCount = this.options.shards.length;
      } else {
        this.options.totalShardCount = this.options.shardCount;
      }
    }
    if (typeof this.options.shards === 'undefined' && this.options.shardCount) {
      this.options.shards = [];
      for (let i = 0; i < this.options.shardCount; ++i) this.options.shards.push(i);
    }

    this._validateOptions();

    /**
     * The WebSocket manager of the client
     * @type {WebSocketManager}
     */
    this.ws = new WebSocketManager(this);

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
    this.voice = !browser ? new ClientVoiceManager(this) : null;

    /**
     * Shard helpers for the client (only if the process was spawned from a {@link ShardingManager})
     * @type {?ShardClientUtil}
     */
    this.shard = !browser && process.env.SHARDING_MANAGER ?
      ShardClientUtil.singleton(this, process.env.SHARDING_MANAGER_MODE) :
      null;

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
     * as long as sharding isn't being used, this will be *every* channel in *every* guild the bot
     * is a member of, and all DM channels
     * @type {ChannelStore<Snowflake, Channel>}
     */
    this.channels = new ChannelStore(this);

    const ClientPresence = Structures.get('ClientPresence');
    /**
     * The presence of the Client
     * @private
     * @type {ClientPresence}
     */
    this.presence = new ClientPresence(this);

    Object.defineProperty(this, 'token', { writable: true });
    if (!browser && !this.token && 'DISCORD_TOKEN' in process.env) {
      /**
       * Authorization token for the logged in bot
       * <warn>This should be kept private at all times.</warn>
       * @type {?string}
       */
      this.token = process.env.DISCORD_TOKEN;
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

    if (this.options.messageSweepInterval > 0) {
      this.setInterval(this.sweepMessages.bind(this), this.options.messageSweepInterval * 1000);
    }
  }

  /**
   * All active voice connections that have been established, mapped by guild ID
   * @type {Collection<Snowflake, VoiceConnection>}
   * @readonly
   */
  get voiceConnections() {
    if (browser) return new Collection();
    return this.voice.connections;
  }

  /**
   * All custom emojis that the client has access to, mapped by their IDs
   * @type {GuildEmojiStore<Snowflake, GuildEmoji>}
   * @readonly
   */
  get emojis() {
    const emojis = new GuildEmojiStore({ client: this });
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
   * How long it has been since the client last entered the `READY` state in milliseconds
   * @type {?number}
   * @readonly
   */
  get uptime() {
    return this.readyAt ? Date.now() - this.readyAt : null;
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
   * @param {string} token Token of the account to log in with
   * @returns {Promise<string>} Token of the account used
   * @example
   * client.login('my token');
   */
  async login(token = this.token) {
    if (!token || typeof token !== 'string') throw new Error('TOKEN_INVALID');
    this.token = token = token.replace(/^(Bot|Bearer)\s*/i, '');
    this.emit(Events.DEBUG, `Authenticating using token ${token}`);
    let endpoint = this.api.gateway;
    if (this.options.shardCount === 'auto') endpoint = endpoint.bot;
    const res = await endpoint.get();
    if (this.options.presence) {
      this.options.ws.presence = await this.presence._parse(this.options.presence);
    }
    if (res.session_start_limit && res.session_start_limit.remaining === 0) {
      const { session_start_limit: { reset_after } } = res;
      this.emit(Events.DEBUG, `Exceeded identify threshold, setting a timeout for ${reset_after} ms`);
      await delayFor(reset_after);
    }
    const gateway = `${res.url}/`;
    if (this.options.shardCount === 'auto') {
      this.emit(Events.DEBUG, `Using recommended shard count ${res.shards}`);
      this.options.shardCount = res.shards;
      this.options.totalShardCount = res.shards;
      if (typeof this.options.shards === 'undefined' || !this.options.shards.length) {
        this.options.shards = [];
        for (let i = 0; i < this.options.shardCount; ++i) this.options.shards.push(i);
      }
    }
    this.emit(Events.DEBUG, `Using gateway ${gateway}`);
    this.ws.connect(gateway);
    await new Promise((resolve, reject) => {
      const onready = () => {
        clearTimeout(timeout);
        this.removeListener(Events.DISCONNECT, ondisconnect);
        resolve();
      };
      const ondisconnect = event => {
        clearTimeout(timeout);
        this.removeListener(Events.READY, onready);
        this.destroy();
        if (WSCodes[event.code]) {
          reject(new Error(WSCodes[event.code]));
        }
      };
      const timeout = setTimeout(() => {
        this.removeListener(Events.READY, onready);
        this.removeListener(Events.DISCONNECT, ondisconnect);
        this.destroy();
        reject(new Error('WS_CONNECTION_TIMEOUT'));
      }, this.options.shardCount * 25e3);
      if (timeout.unref !== undefined) timeout.unref();
      this.once(Events.READY, onready);
      this.once(Events.DISCONNECT, ondisconnect);
    });
    return token;
  }

  /**
   * Logs out, terminates the connection to Discord, and destroys the client.
   * @returns {void}
   */
  destroy() {
    super.destroy();
    this.ws.destroy();
    this.token = null;
  }

  /**
   * Obtains an invite from Discord.
   * @param {InviteResolvable} invite Invite code or URL
   * @returns {Promise<Invite>}
   * @example
   * client.fetchInvite('https://discord.gg/bRCvFy9')
   *   .then(invite => console.log(`Obtained invite with code: ${invite.code}`))
   *   .catch(console.error);
   */
  fetchInvite(invite) {
    const code = DataResolver.resolveInviteCode(invite);
    return this.api.invites(code).get({ query: { with_counts: true } })
      .then(data => new Invite(this, data));
  }

  /**
   * Obtains a webhook from Discord.
   * @param {Snowflake} id ID of the webhook
   * @param {string} [token] Token for the webhook
   * @returns {Promise<Webhook>}
   * @example
   * client.fetchWebhook('id', 'token')
   *   .then(webhook => console.log(`Obtained webhook with name: ${webhook.name}`))
   *   .catch(console.error);
   */
  fetchWebhook(id, token) {
    return this.api.webhooks(id, token).get().then(data => new Webhook(this, data));
  }

  /**
   * Obtains the available voice regions from Discord.
   * @returns {Collection<string, VoiceRegion>}
   * @example
   * client.fetchVoiceRegions()
   *   .then(regions => console.log(`Available regions are: ${regions.map(region => region.name).join(', ')}`))
   *   .catch(console.error);
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
   * @example
   * // Remove all messages older than 1800 seconds from the messages cache
   * const amount = client.sweepMessages(1800);
   * console.log(`Successfully removed ${amount} messages from the cache.`);
   */
  sweepMessages(lifetime = this.options.messageCacheLifetime) {
    if (typeof lifetime !== 'number' || isNaN(lifetime)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'Lifetime', 'a number');
    }
    if (lifetime <= 0) {
      this.emit(Events.DEBUG, 'Didn\'t sweep messages - lifetime is unlimited');
      return -1;
    }

    const lifetimeMs = lifetime * 1000;
    const now = Date.now();
    let channels = 0;
    let messages = 0;

    for (const channel of this.channels.values()) {
      if (!channel.messages) continue;
      channels++;

      messages += channel.messages.sweep(
        message => now - (message.editedTimestamp || message.createdTimestamp) > lifetimeMs
      );
    }

    this.emit(Events.DEBUG,
      `Swept ${messages} messages older than ${lifetime} seconds in ${channels} text-based channels`);
    return messages;
  }

  /**
   * Obtains the OAuth Application of this bot from Discord.
   * @returns {Promise<ClientApplication>}
   */
  fetchApplication() {
    return this.api.oauth2.applications('@me').get()
      .then(app => new ClientApplication(this, app));
  }

  /**
   * Generates a link that can be used to invite the bot to a guild.
   * @param {PermissionResolvable} [permissions] Permissions to request
   * @returns {Promise<string>}
   * @example
   * client.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
   *   .then(link => console.log(`Generated bot invite link: ${link}`))
   *   .catch(console.error);
   */
  generateInvite(permissions) {
    permissions = Permissions.resolve(permissions);
    return this.fetchApplication().then(application =>
      `https://discordapp.com/oauth2/authorize?client_id=${application.id}&permissions=${permissions}&scope=bot`
    );
  }

  toJSON() {
    return super.toJSON({
      readyAt: false,
      broadcasts: false,
      presences: false,
    });
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
  _validateOptions(options = this.options) { // eslint-disable-line complexity
    if (options.shardCount !== 'auto' && (typeof options.shardCount !== 'number' || isNaN(options.shardCount))) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'shardCount', 'a number or "auto"');
    }
    if (options.shards && typeof options.shards !== 'number' && !Array.isArray(options.shards)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'shards', 'a number or array');
    }
    if (options.shardCount < 1) throw new RangeError('CLIENT_INVALID_OPTION', 'shardCount', 'at least 1');
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
    if (!(options.partials instanceof Array)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'partials', 'an Array');
    }
    if (typeof options.restWsBridgeTimeout !== 'number' || isNaN(options.restWsBridgeTimeout)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'restWsBridgeTimeout', 'a number');
    }
    if (typeof options.restSweepInterval !== 'number' || isNaN(options.restSweepInterval)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'restSweepInterval', 'a number');
    }
    if (!(options.disabledEvents instanceof Array)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'disabledEvents', 'an Array');
    }
    if (typeof options.retryLimit !== 'number' || isNaN(options.retryLimit)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'retryLimit', 'a number');
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
