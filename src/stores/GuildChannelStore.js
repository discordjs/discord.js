const Collection = require('../util/Collection');
const Channel = require('../structures/Channel');
const { ChannelTypes } = require('../util/Constants');
const DataStore = require('./DataStore');
const GuildChannel = require('../structures/GuildChannel');
const Permissions = require('../util/Permissions');

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
   * @typedef {Object} ChannelCreationOverwrites
   * @property {PermissionResolvable[]|number} [allow] The permissions to allow
   * @property {PermissionResolvable[]|number} [deny] The permissions to deny
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
   * @param {Array<PermissionOverwrites|ChannelCreationOverwrites>} [options.overwrites] Permission overwrites
   * @param {string} [options.reason] Reason for creating the channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Create a new text channel
   * guild.channels.create('new-general', { reason: 'Needed a cool new channel' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  create(name, { type, nsfw, bitrate, userLimit, parent, overwrites, reason } = {}) {
    if (overwrites instanceof Collection || overwrites instanceof Array) {
      overwrites = overwrites.map(overwrite => {
        let allow = overwrite.allow || (overwrite.allowed ? overwrite.allowed.bitfield : 0);
        let deny = overwrite.deny || (overwrite.denied ? overwrite.denied.bitfield : 0);
        if (allow instanceof Array) allow = Permissions.resolve(allow);
        if (deny instanceof Array) deny = Permissions.resolve(deny);

        const role = this.guild.roles.resolve(overwrite.id);
        if (role) {
          overwrite.id = role.id;
          overwrite.type = 'role';
        } else {
          overwrite.id = this.client.users.resolveID(overwrite.id);
          overwrite.type = 'member';
        }

        return {
          allow,
          deny,
          type: overwrite.type,
          id: overwrite.id,
        };
      });
    }

    if (parent) parent = this.client.channels.resolveID(parent);
    return this.client.api.guilds(this.guild.id).channels.post({
      data: {
        name,
        type: type ? ChannelTypes[type.toUpperCase()] : 'text',
        nsfw,
        bitrate,
        user_limit: userLimit,
        parent_id: parent,
        permission_overwrites: overwrites,
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
