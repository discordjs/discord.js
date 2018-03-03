const Channel = require('../structures/Channel');
const { ChannelTypes } = require('../util/Constants');
const DataStore = require('./DataStore');
const GuildChannel = require('../structures/GuildChannel');
const resolvePermissions = require('../structures/shared/resolvePermissions');

/**
 * Stores guild channels.
 * @extends {DataStore}
 */
class GuildChannelStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, GuildChannel);
    this.guild = guild;
  }

  add(data) {
    const existing = this.get(data.id);
    if (existing) return existing;

    return Channel.create(this.client, data, this.guild);
  }

  /**
   * Can be used to overwrite permissions when creating a channel.
   * @typedef {Object} PermissionOverwriteOptions
   * @property {PermissionResolvable[]|number} [allowed] The permissions to allow
   * @property {PermissionResolvable[]|number} [denied] The permissions to deny
   * @property {RoleResolvable|UserResolvable} id ID of the role or member this overwrite is for
   */

  /**
   * Creates a new channel in the guild.
   * @param {string} name The name of the new channel
   * @param {Object} [options] Options
   * @param {string} [options.type='text'] The type of the new channel, either `text`, `voice`, or `category`
   * @param {boolean} [options.nsfw] Whether the new channel is nsfw
   * @param {number} [options.bitrate] Bitrate of the new channel in bits (only voice)
   * @param {number} [options.userLimit] Maximum amount of users allowed in the new channel (only voice)
   * @param {ChannelResolvable} [options.parent] Parent of the new channel
   * @param {Array<PermissionOverwrites|PermissionOverwriteOptions>} [options.overwrites] Permission overwrites
   * @param {string} [options.reason] Reason for creating the channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Create a new text channel
   * guild.channels.create('new-general', { reason: 'Needed a cool new channel' })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Create a new channel with overwrites
   * guild.channels.create('new-voice', {
   *   type: 'voice',
   *   overwrites: [
   *      {
   *        id: message.author.id,
   *        denied: ['VIEW_CHANNEL'],
   *     },
   *   ],
   * })
   */
  create(name, { type, nsfw, bitrate, userLimit, parent, overwrites, reason } = {}) {
    if (parent) parent = this.client.channels.resolveID(parent);
    return this.client.api.guilds(this.guild.id).channels.post({
      data: {
        name,
        type: type ? ChannelTypes[type.toUpperCase()] : 'text',
        nsfw,
        bitrate,
        user_limit: userLimit,
        parent_id: parent,
        permission_overwrites: resolvePermissions.call(this, overwrites),
      },
      reason,
    }).then(data => this.client.actions.ChannelCreate.handle(data).channel);
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
   * @memberof GuildChannelStore
   * @instance
   * @param {GuildChannelResolvable} channel The GuildChannel resolvable to resolve
   * @returns {?Channel}
   */

  /**
   * Resolves a GuildChannelResolvable to a channel ID string.
   * @method resolveID
   * @memberof GuildChannelStore
   * @instance
   * @param {GuildChannelResolvable} channel The GuildChannel resolvable to resolve
   * @returns {?Snowflake}
   */
}

module.exports = GuildChannelStore;
