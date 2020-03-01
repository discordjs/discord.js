'use strict';

const BaseManager = require('./BaseManager');
const GuildChannel = require('../structures/GuildChannel');
const PermissionOverwrites = require('../structures/PermissionOverwrites');
const { ChannelTypes } = require('../util/Constants');

/**
 * Manages API methods for GuildChannels and stores their cache.
 * @extends {BaseManager}
 */
class GuildChannelManager extends BaseManager {
  constructor(guild, iterable) {
    super(guild.client, iterable, GuildChannel);

    /**
     * The guild this Manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, GuildChannel>}
   * @name GuildChannelManager#cache
   */

  add(channel) {
    const existing = this.cache.get(channel.id);
    if (existing) return existing;
    this.cache.set(channel.id, channel);
    return channel;
  }

  /**
   * Data that can be resolved to give a Guild Channel object. This can be:
   * * A GuildChannel object
   * * A Snowflake
   * @typedef {GuildChannel|Snowflake} GuildChannelResolvable
   */

  /**
   * Resolves a GuildChannelResolvable to a Channel object.
   * @method resolve
   * @memberof GuildChannelManager
   * @instance
   * @param {GuildChannelResolvable} channel The GuildChannel resolvable to resolve
   * @returns {?Channel}
   */

  /**
   * Resolves a GuildChannelResolvable to a channel ID string.
   * @method resolveID
   * @memberof GuildChannelManager
   * @instance
   * @param {GuildChannelResolvable} channel The GuildChannel resolvable to resolve
   * @returns {?Snowflake}
   */

  /**
   * Creates a new channel in the guild.
   * @param {string} name The name of the new channel
   * @param {Object} [options] Options
   * @param {string} [options.type='text'] The type of the new channel, either `text`, `voice`, or `category`
   * @param {string} [options.topic] The topic for the new channel
   * @param {boolean} [options.nsfw] Whether the new channel is nsfw
   * @param {number} [options.bitrate] Bitrate of the new channel in bits (only voice)
   * @param {number} [options.userLimit] Maximum amount of users allowed in the new channel (only voice)
   * @param {ChannelResolvable} [options.parent] Parent of the new channel
   * @param {OverwriteResolvable[]|Collection<Snowflake, OverwriteResolvable>} [options.permissionOverwrites]
   * Permission overwrites of the new channel
   * @param {number} [options.position] Position of the new channel
   * @param {number} [options.rateLimitPerUser] The ratelimit per user for the channel
   * @param {string} [options.reason] Reason for creating the channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Create a new text channel
   * guild.channels.create('new-general', { reason: 'Needed a cool new channel' })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Create a new channel with permission overwrites
   * guild.channels.create('new-voice', {
   *   type: 'voice',
   *   permissionOverwrites: [
   *      {
   *        id: message.author.id,
   *        deny: ['VIEW_CHANNEL'],
   *     },
   *   ],
   * })
   */
  async create(name, options = {}) {
    let {
      type,
      topic,
      nsfw,
      bitrate,
      userLimit,
      parent,
      permissionOverwrites,
      position,
      rateLimitPerUser,
      reason,
    } = options;
    if (parent) parent = this.client.channels.resolveID(parent);
    if (permissionOverwrites) {
      permissionOverwrites = permissionOverwrites.map(o => PermissionOverwrites.resolve(o, this.guild));
    }

    const data = await this.client.api.guilds(this.guild.id).channels.post({
      data: {
        name,
        topic,
        type: type ? ChannelTypes[type.toUpperCase()] : ChannelTypes.TEXT,
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
}

module.exports = GuildChannelManager;
