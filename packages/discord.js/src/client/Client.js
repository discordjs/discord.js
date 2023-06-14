'use strict';

const process = require('node:process');
const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { OAuth2Scopes, Routes } = require('discord-api-types/v10');
const BaseClient = require('./BaseClient');
const ActionsManager = require('./actions/ActionsManager');
const ClientVoiceManager = require('./voice/ClientVoiceManager');
const WebSocketManager = require('./websocket/WebSocketManager');
const { DiscordjsError, DiscordjsTypeError, DiscordjsRangeError, ErrorCodes } = require('../errors');
const BaseGuildEmojiManager = require('../managers/BaseGuildEmojiManager');
const ChannelManager = require('../managers/ChannelManager');
const GuildManager = require('../managers/GuildManager');
const UserManager = require('../managers/UserManager');
const ShardClientUtil = require('../sharding/ShardClientUtil');
const ClientPresence = require('../structures/ClientPresence');
const GuildPreview = require('../structures/GuildPreview');
const GuildTemplate = require('../structures/GuildTemplate');
const Invite = require('../structures/Invite');
const { Sticker } = require('../structures/Sticker');
const StickerPack = require('../structures/StickerPack');
const VoiceRegion = require('../structures/VoiceRegion');
const Webhook = require('../structures/Webhook');
const Widget = require('../structures/Widget');
const DataResolver = require('../util/DataResolver');
const Events = require('../util/Events');
const IntentsBitField = require('../util/IntentsBitField');
const Options = require('../util/Options');
const PermissionsBitField = require('../util/PermissionsBitField');
const Status = require('../util/Status');
const Sweepers = require('../util/Sweepers');

/**
 * The main hub for interacting with the Discord API, and the starting point for any bot.
 * @extends {BaseClient}
 */
class Client extends BaseClient {
  /**
   * @param {ClientOptions} options Options for the client
   */
  constructor(options) {
    super(options);

    const data = require('node:worker_threads').workerData ?? process.env;
    const defaults = Options.createDefault();

    if (this.options.shards === defaults.shards) {
      if ('SHARDS' in data) {
        this.options.shards = JSON.parse(data.SHARDS);
      }
    }

    if (this.options.shardCount === defaults.shardCount) {
      if ('SHARD_COUNT' in data) {
        this.options.shardCount = Number(data.SHARD_COUNT);
      } else if (Array.isArray(this.options.shards)) {
        this.options.shardCount = this.options.shards.length;
      }
    }

    const typeofShards = typeof this.options.shards;

    if (typeofShards === 'undefined' && typeof this.options.shardCount === 'number') {
      this.options.shards = Array.from({ length: this.options.shardCount }, (_, i) => i);
    }

    if (typeofShards === 'number') this.options.shards = [this.options.shards];

    if (Array.isArray(this.options.shards)) {
      this.options.shards = [
        ...new Set(
          this.options.shards.filter(item => !isNaN(item) && item >= 0 && item < Infinity && item === (item | 0)),
        ),
      ];
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
     * The voice manager of the client
     * @type {ClientVoiceManager}
     */
    this.voice = new ClientVoiceManager(this);

    /**
     * Shard helpers for the client (only if the process was spawned from a {@link ShardingManager})
     * @type {?ShardClientUtil}
     */
    this.shard = process.env.SHARDING_MANAGER
      ? ShardClientUtil.singleton(this, process.env.SHARDING_MANAGER_MODE)
      : null;

    /**
     * All of the {@link User} objects that have been cached at any point, mapped by their ids
     * @type {UserManager}
     */
    this.users = new UserManager(this);

    /**
     * All of the guilds the client is currently handling, mapped by their ids -
     * as long as sharding isn't being used, this will be *every* guild the bot is a member of
     * @type {GuildManager}
     */
    this.guilds = new GuildManager(this);

    /**
     * All of the {@link BaseChannel}s that the client is currently handling, mapped by their ids -
     * as long as sharding isn't being used, this will be *every* channel in *every* guild the bot
     * is a member of. Note that DM channels will not be initially cached, and thus not be present
     * in the Manager without their explicit fetching or use.
     * @type {ChannelManager}
     */
    this.channels = new ChannelManager(this);

    /**
     * The sweeping functions and their intervals used to periodically sweep caches
     * @type {Sweepers}
     */
    this.sweepers = new Sweepers(this, this.options.sweepers);

    /**
     * The presence of the Client
     * @private
     * @type {ClientPresence}
     */
    this.presence = new ClientPresence(this, this.options.presence);

    Object.defineProperty(this, 'token', { writable: true });
    if (!this.token && 'DISCORD_TOKEN' in process.env) {
      /**
       * Authorization token for the logged in bot.
       * If present, this defaults to `process.env.DISCORD_TOKEN` when instantiating the client
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
     * The application of this bot
     * @type {?ClientApplication}
     */
    this.application = null;

    /**
     * Timestamp of the time the client was last {@link Status.Ready} at
     * @type {?number}
     */
    this.readyTimestamp = null;
  }

  /**
   * All custom emojis that the client has access to, mapped by their ids
   * @type {BaseGuildEmojiManager}
   * @readonly
   */
  get emojis() {
    const emojis = new BaseGuildEmojiManager(this);
    for (const guild of this.guilds.cache.values()) {
      if (guild.available) for (const emoji of guild.emojis.cache.values()) emojis.cache.set(emoji.id, emoji);
    }
    return emojis;
  }

  /**
   * Time at which the client was last regarded as being in the {@link Status.Ready} state
   * (each time the client disconnects and successfully reconnects, this will be overwritten)
   * @type {?Date}
   * @readonly
   */
  get readyAt() {
    return this.readyTimestamp && new Date(this.readyTimestamp);
  }

  /**
   * How long it has been since the client last entered the {@link Status.Ready} state in milliseconds
   * @type {?number}
   * @readonly
   */
  get uptime() {
    return this.readyTimestamp && Date.now() - this.readyTimestamp;
  }

  /**
   * Logs the client in, establishing a WebSocket connection to Discord.
   * @param {string} [token=this.token] Token of the account to log in with
   * @returns {Promise<string>} Token of the account used
   * @example
   * client.login('my token');
   */
  async login(token = this.token) {
    if (!token || typeof token !== 'string') throw new DiscordjsError(ErrorCodes.TokenInvalid);
    this.token = token = token.replace(/^(Bot|Bearer)\s*/i, '');
    this.rest.setToken(token);
    this.emit(Events.Debug, `Provided token: ${this._censoredToken}`);

    if (this.options.presence) {
      this.options.ws.presence = this.presence._parse(this.options.presence);
    }

    this.emit(Events.Debug, 'Preparing to connect to the gateway...');

    try {
      await this.ws.connect();
      return this.token;
    } catch (error) {
      await this.destroy();
      throw error;
    }
  }

  /**
   * Returns whether the client has logged in, indicative of being able to access
   * properties such as `user` and `application`.
   * @returns {boolean}
   */
  isReady() {
    return this.ws.status === Status.Ready;
  }

  /**
   * Logs out, terminates the connection to Discord, and destroys the client.
   * @returns {Promise<void>}
   */
  async destroy() {
    super.destroy();

    this.sweepers.destroy();
    await this.ws.destroy();
    this.token = null;
    this.rest.setToken(null);
  }

  /**
   * Options used when fetching an invite from Discord.
   * @typedef {Object} ClientFetchInviteOptions
   * @property {Snowflake} [guildScheduledEventId] The id of the guild scheduled event to include with
   * the invite
   */

  /**
   * Obtains an invite from Discord.
   * @param {InviteResolvable} invite Invite code or URL
   * @param {ClientFetchInviteOptions} [options] Options for fetching the invite
   * @returns {Promise<Invite>}
   * @example
   * client.fetchInvite('https://discord.gg/djs')
   *   .then(invite => console.log(`Obtained invite with code: ${invite.code}`))
   *   .catch(console.error);
   */
  async fetchInvite(invite, options) {
    const code = DataResolver.resolveInviteCode(invite);
    const query = makeURLSearchParams({
      with_counts: true,
      with_expiration: true,
      guild_scheduled_event_id: options?.guildScheduledEventId,
    });
    const data = await this.rest.get(Routes.invite(code), { query });
    return new Invite(this, data);
  }

  /**
   * Obtains a template from Discord.
   * @param {GuildTemplateResolvable} template Template code or URL
   * @returns {Promise<GuildTemplate>}
   * @example
   * client.fetchGuildTemplate('https://discord.new/FKvmczH2HyUf')
   *   .then(template => console.log(`Obtained template with code: ${template.code}`))
   *   .catch(console.error);
   */
  async fetchGuildTemplate(template) {
    const code = DataResolver.resolveGuildTemplateCode(template);
    const data = await this.rest.get(Routes.template(code));
    return new GuildTemplate(this, data);
  }

  /**
   * Obtains a webhook from Discord.
   * @param {Snowflake} id The webhook's id
   * @param {string} [token] Token for the webhook
   * @returns {Promise<Webhook>}
   * @example
   * client.fetchWebhook('id', 'token')
   *   .then(webhook => console.log(`Obtained webhook with name: ${webhook.name}`))
   *   .catch(console.error);
   */
  async fetchWebhook(id, token) {
    const data = await this.rest.get(Routes.webhook(id, token), { auth: token === undefined });
    return new Webhook(this, { token, ...data });
  }

  /**
   * Obtains the available voice regions from Discord.
   * @returns {Promise<Collection<string, VoiceRegion>>}
   * @example
   * client.fetchVoiceRegions()
   *   .then(regions => console.log(`Available regions are: ${regions.map(region => region.name).join(', ')}`))
   *   .catch(console.error);
   */
  async fetchVoiceRegions() {
    const apiRegions = await this.rest.get(Routes.voiceRegions());
    const regions = new Collection();
    for (const region of apiRegions) regions.set(region.id, new VoiceRegion(region));
    return regions;
  }

  /**
   * Obtains a sticker from Discord.
   * @param {Snowflake} id The sticker's id
   * @returns {Promise<Sticker>}
   * @example
   * client.fetchSticker('id')
   *   .then(sticker => console.log(`Obtained sticker with name: ${sticker.name}`))
   *   .catch(console.error);
   */
  async fetchSticker(id) {
    const data = await this.rest.get(Routes.sticker(id));
    return new Sticker(this, data);
  }

  /**
   * Obtains the list of sticker packs available to Nitro subscribers from Discord.
   * @returns {Promise<Collection<Snowflake, StickerPack>>}
   * @example
   * client.fetchPremiumStickerPacks()
   *   .then(packs => console.log(`Available sticker packs are: ${packs.map(pack => pack.name).join(', ')}`))
   *   .catch(console.error);
   */
  async fetchPremiumStickerPacks() {
    const data = await this.rest.get(Routes.nitroStickerPacks());
    return new Collection(data.sticker_packs.map(p => [p.id, new StickerPack(this, p)]));
  }

  /**
   * Obtains a guild preview from Discord, available for all guilds the bot is in and all Discoverable guilds.
   * @param {GuildResolvable} guild The guild to fetch the preview for
   * @returns {Promise<GuildPreview>}
   */
  async fetchGuildPreview(guild) {
    const id = this.guilds.resolveId(guild);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'guild', 'GuildResolvable');
    const data = await this.rest.get(Routes.guildPreview(id));
    return new GuildPreview(this, data);
  }

  /**
   * Obtains the widget data of a guild from Discord, available for guilds with the widget enabled.
   * @param {GuildResolvable} guild The guild to fetch the widget data for
   * @returns {Promise<Widget>}
   */
  async fetchGuildWidget(guild) {
    const id = this.guilds.resolveId(guild);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'guild', 'GuildResolvable');
    const data = await this.rest.get(Routes.guildWidgetJSON(id));
    return new Widget(this, data);
  }

  /**
   * Options for {@link Client#generateInvite}.
   * @typedef {Object} InviteGenerationOptions
   * @property {OAuth2Scopes[]} scopes Scopes that should be requested
   * @property {PermissionResolvable} [permissions] Permissions to request
   * @property {GuildResolvable} [guild] Guild to preselect
   * @property {boolean} [disableGuildSelect] Whether to disable the guild selection
   */

  /**
   * Generates a link that can be used to invite the bot to a guild.
   * @param {InviteGenerationOptions} [options={}] Options for the invite
   * @returns {string}
   * @example
   * const link = client.generateInvite({
   *   scopes: [OAuth2Scopes.ApplicationsCommands],
   * });
   * console.log(`Generated application invite link: ${link}`);
   * @example
   * const link = client.generateInvite({
   *   permissions: [
   *     PermissionFlagsBits.SendMessages,
   *     PermissionFlagsBits.ManageGuild,
   *     PermissionFlagsBits.MentionEveryone,
   *   ],
   *   scopes: [OAuth2Scopes.Bot],
   * });
   * console.log(`Generated bot invite link: ${link}`);
   */
  generateInvite(options = {}) {
    if (typeof options !== 'object') throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'options', 'object', true);
    if (!this.application) throw new DiscordjsError(ErrorCodes.ClientNotReady, 'generate an invite link');

    const { scopes } = options;
    if (scopes === undefined) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidMissingScopes);
    }
    if (!Array.isArray(scopes)) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'scopes', 'Array of Invite Scopes', true);
    }
    if (!scopes.some(scope => [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands].includes(scope))) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidMissingScopes);
    }
    if (!scopes.includes(OAuth2Scopes.Bot) && options.permissions) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidScopesWithPermissions);
    }
    const validScopes = Object.values(OAuth2Scopes);
    const invalidScope = scopes.find(scope => !validScopes.includes(scope));
    if (invalidScope) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidElement, 'Array', 'scopes', invalidScope);
    }

    const query = makeURLSearchParams({
      client_id: this.application.id,
      scope: scopes.join(' '),
      disable_guild_select: options.disableGuildSelect,
    });

    if (options.permissions) {
      const permissions = PermissionsBitField.resolve(options.permissions);
      if (permissions) query.set('permissions', permissions.toString());
    }

    if (options.guild) {
      const guildId = this.guilds.resolveId(options.guild);
      if (!guildId) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'options.guild', 'GuildResolvable');
      query.set('guild_id', guildId);
    }

    return `${this.options.rest.api}${Routes.oauth2Authorization()}?${query}`;
  }

  toJSON() {
    return super.toJSON({
      actions: false,
      presence: false,
    });
  }

  /**
   * Partially censored client token for debug logging purposes.
   * @type {?string}
   * @readonly
   * @private
   */
  get _censoredToken() {
    if (!this.token) return null;

    return this.token
      .split('.')
      .map((val, i) => (i > 1 ? val.replace(/./g, '*') : val))
      .join('.');
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
    if (options.intents === undefined) {
      throw new DiscordjsTypeError(ErrorCodes.ClientMissingIntents);
    } else {
      options.intents = new IntentsBitField(options.intents).freeze();
    }
    if (typeof options.shardCount !== 'number' || isNaN(options.shardCount) || options.shardCount < 1) {
      throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'shardCount', 'a number greater than or equal to 1');
    }
    if (options.shards && !(options.shards === 'auto' || Array.isArray(options.shards))) {
      throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'shards', "'auto', a number or array of numbers");
    }
    if (options.shards && !options.shards.length) throw new DiscordjsRangeError(ErrorCodes.ClientInvalidProvidedShards);
    if (typeof options.makeCache !== 'function') {
      throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'makeCache', 'a function');
    }
    if (typeof options.sweepers !== 'object' || options.sweepers === null) {
      throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'sweepers', 'an object');
    }
    if (!Array.isArray(options.partials)) {
      throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'partials', 'an Array');
    }
    if (typeof options.waitGuildTimeout !== 'number' || isNaN(options.waitGuildTimeout)) {
      throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'waitGuildTimeout', 'a number');
    }
    if (typeof options.failIfNotExists !== 'boolean') {
      throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'failIfNotExists', 'a boolean');
    }
    if (
      (typeof options.allowedMentions !== 'object' && options.allowedMentions !== undefined) ||
      options.allowedMentions === null
    ) {
      throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'allowedMentions', 'an object');
    }
    if (typeof options.presence !== 'object' || options.presence === null) {
      throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'presence', 'an object');
    }
    if (typeof options.ws !== 'object' || options.ws === null) {
      throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'ws', 'an object');
    }
    if (typeof options.rest !== 'object' || options.rest === null) {
      throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'rest', 'an object');
    }
    if (typeof options.jsonTransformer !== 'function') {
      throw new DiscordjsTypeError(ErrorCodes.ClientInvalidOption, 'jsonTransformer', 'a function');
    }
  }
}

module.exports = Client;

/**
 * @class SnowflakeUtil
 * @classdesc This class is an alias for {@link https://www.npmjs.com/package/@sapphire/snowflake @sapphire/snowflake}'s
 * `DiscordSnowflake` class.
 *
 * Check their documentation
 * {@link https://www.sapphirejs.dev/docs/Documentation/api-utilities/classes/sapphire_snowflake.Snowflake here}
 * ({@link https://www.sapphirejs.dev/docs/Guide/utilities/snowflake guide})
 * to see what you can do.
 * @hideconstructor
 */

/**
 * A {@link https://developer.twitter.com/en/docs/twitter-ids Twitter snowflake},
 * except the epoch is 2015-01-01T00:00:00.000Z.
 *
 * If we have a snowflake '266241948824764416' we can represent it as binary:
 * ```
 * 64                                          22     17     12          0
 *  000000111011000111100001101001000101000000  00001  00000  000000000000
 *  number of milliseconds since Discord epoch  worker  pid    increment
 * ```
 * @typedef {string} Snowflake
 */

/**
 * Emitted for general debugging information.
 * @event Client#debug
 * @param {string} info The debug information
 */

/**
 * Emitted for general warnings.
 * @event Client#warn
 * @param {string} info The warning
 */

/**
 * @external Collection
 * @see {@link https://discord.js.org/docs/packages/collection/stable/Collection:Class}
 */

/**
 * @external ImageURLOptions
 * @see {@link https://discord.js.org/docs/packages/rest/stable/ImageURLOptions:Interface}
 */

/**
 * @external BaseImageURLOptions
 * @see {@link https://discord.js.org/docs/packages/rest/stable/BaseImageURLOptions:Interface}
 */
