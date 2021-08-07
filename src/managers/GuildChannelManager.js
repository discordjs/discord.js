'use strict';

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const ThreadManager = require('./ThreadManager');
const { Error } = require('../errors');
const GuildChannel = require('../structures/GuildChannel');
const PermissionOverwrites = require('../structures/PermissionOverwrites');
const ThreadChannel = require('../structures/ThreadChannel');
const { ChannelTypes, ThreadChannelTypes } = require('../util/Constants');

let cacheWarningEmitted = false;

/**
 * Manages API methods for GuildChannels and stores their cache.
 * @extends {CachedManager}
 */
class GuildChannelManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, GuildChannel, iterable);
    const defaultCaching =
      this._cache.constructor.name === 'Collection' ||
      ((this._cache.maxSize === undefined || this._cache.maxSize === Infinity) &&
        (this._cache.sweepFilter === undefined || this._cache.sweepFilter.isDefault));
    if (!cacheWarningEmitted && !defaultCaching) {
      cacheWarningEmitted = true;
      process.emitWarning(
        `Overriding the cache handling for ${this.constructor.name} is unsupported and breaks functionality.`,
        'UnsupportedCacheOverwriteWarning',
      );
    }

    /**
     * The guild this Manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The number of channels in this managers cache excluding thread channels
   * that do not count towards a guild's maximum channels restriction.
   * @type {number}
   * @readonly
   */
  get channelCountWithoutThreads() {
    return this.cache.reduce((acc, channel) => {
      if (ThreadChannelTypes.includes(channel.type)) return acc;
      return ++acc;
    }, 0);
  }

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, GuildChannel|ThreadChannel>}
   * @name GuildChannelManager#cache
   */

  _add(channel) {
    const existing = this.cache.get(channel.id);
    if (existing) return existing;
    this.cache.set(channel.id, channel);
    return channel;
  }

  /**
   * Data that can be resolved to give a Guild Channel object. This can be:
   * * A GuildChannel object
   * * A ThreadChannel object
   * * A Snowflake
   * @typedef {GuildChannel|ThreadChannel|Snowflake} GuildChannelResolvable
   */

  /**
   * Resolves a GuildChannelResolvable to a Channel object.
   * @param {GuildChannelResolvable} channel The GuildChannel resolvable to resolve
   * @returns {?(GuildChannel|ThreadChannel)}
   */
  resolve(channel) {
    if (channel instanceof ThreadChannel) return super.resolve(channel.id);
    return super.resolve(channel);
  }

  /**
   * Resolves a GuildChannelResolvable to a channel id.
   * @param {GuildChannelResolvable} channel The GuildChannel resolvable to resolve
   * @returns {?Snowflake}
   */
  resolveId(channel) {
    if (channel instanceof ThreadChannel) return super.resolveId(channel.id);
    return super.resolveId(channel);
  }

  /**
   * Options used to create a new channel in a guild.
   * @typedef {Object} GuildChannelCreateOptions
   * @property {string|number} [type='GUILD_TEXT'] The type of the new channel, either `GUILD_TEXT`, `GUILD_VOICE`,
   * `GUILD_CATEGORY`, `GUILD_NEWS`, `GUILD_STORE`, or `GUILD_STAGE_VOICE`
   * @property {string} [topic] The topic for the new channel
   * @property {boolean} [nsfw] Whether the new channel is nsfw
   * @property {number} [bitrate] Bitrate of the new channel in bits (only voice)
   * @property {number} [userLimit] Maximum amount of users allowed in the new channel (only voice)
   * @property {CategoryChannelResolvable} [parent] Parent of the new channel
   * @property {OverwriteResolvable[]|Collection<Snowflake, OverwriteResolvable>} [permissionOverwrites]
   * Permission overwrites of the new channel
   * @property {number} [position] Position of the new channel
   * @property {number} [rateLimitPerUser] The ratelimit per user for the new channel
   * @property {string} [reason] Reason for creating the new channel
   */

  /**
   * Creates a new channel in the guild.
   * @param {string} name The name of the new channel
   * @param {GuildChannelCreateOptions} [options={}] Options for creating the new channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Create a new text channel
   * guild.channels.create('new-general', { reason: 'Needed a cool new channel' })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Create a new channel with permission overwrites
   * guild.channels.create('new-voice', {
   *   type: 'GUILD_VOICE',
   *   permissionOverwrites: [
   *      {
   *        id: message.author.id,
   *        deny: [Permissions.FLAGS.VIEW_CHANNEL],
   *     },
   *   ],
   * })
   */
  async create(
    name,
    { type, topic, nsfw, bitrate, userLimit, parent, permissionOverwrites, position, rateLimitPerUser, reason } = {},
  ) {
    if (parent) parent = this.client.channels.resolveId(parent);
    if (permissionOverwrites) {
      permissionOverwrites = permissionOverwrites.map(o => PermissionOverwrites.resolve(o, this.guild));
    }

    const data = await this.client.api.guilds(this.guild.id).channels.post({
      data: {
        name,
        topic,
        type: typeof type === 'number' ? type : ChannelTypes[type] ?? ChannelTypes.GUILD_TEXT,
        nsfw,
        bitrate,
        user_limit: userLimit,
        parent_id: parent,
        position,
        permission_overwrites: permissionOverwrites,
        rate_limit_per_user: rateLimitPerUser,
      },
      reason,
    });
    return this.client.actions.ChannelCreate.handle(data).channel;
  }

  /**
   * Obtains one or more guild channels from Discord, or the channel cache if they're already available.
   * @param {Snowflake} [id] The channel's id
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<?GuildChannel|Collection<Snowflake, GuildChannel>>}
   * @example
   * // Fetch all channels from the guild (excluding threads)
   * message.guild.channels.fetch()
   *   .then(channels => console.log(`There are ${channels.size} channels.`))
   *   .catch(console.error);
   * @example
   * // Fetch a single channel
   * message.guild.channels.fetch('222197033908436994')
   *   .then(channel => console.log(`The channel name is: ${channel.name}`))
   *   .catch(console.error);
   */
  async fetch(id, { cache = true, force = false } = {}) {
    if (id && !force) {
      const existing = this.cache.get(id);
      if (existing) return existing;
    }

    if (id) {
      const data = await this.client.api.channels(id).get();
      // Since this is the guild manager, throw if on a different guild
      if (this.guild.id !== data.guild_id) throw new Error('GUILD_CHANNEL_UNOWNED');
      return this.client.channels._add(data, this.guild, { cache });
    }

    const data = await this.client.api.guilds(this.guild.id).channels.get();
    const channels = new Collection();
    for (const channel of data) channels.set(channel.id, this.client.channels._add(channel, this.guild, { cache }));
    return channels;
  }

  /**
   * Obtains all active thread channels in the guild from Discord
   * @param {boolean} [cache=true] Whether to cache the fetched data
   * @returns {Promise<FetchedThreads>}
   * @example
   * // Fetch all threads from the guild
   * message.guild.channels.fetchActiveThreads()
   *   .then(fetched => console.log(`There are ${fetched.threads.size} threads.`))
   *   .catch(console.error);
   */
  async fetchActiveThreads(cache = true) {
    const raw = await this.client.api.guilds(this.guild.id).threads.active.get();
    return ThreadManager._mapThreads(raw, this.client, { guild: this.guild, cache });
  }
}

module.exports = GuildChannelManager;

/**
 * @external APIActiveThreadsList
 * @see {@link https://discord.com/developers/docs/resources/guild#list-active-threads-response-body}
 */
