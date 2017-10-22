const DataStore = require('./DataStore');
const Channel = require('../structures/Channel');
const GuildChannel = require('../structures/GuildChannel');

/**
 * Stores guild channels.
 * @private
 * @extends {DataStore}
 */
class GuildChannelStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, GuildChannel);
    this.guild = guild;
  }

  create(data) {
    const existing = this.get(data.id);
    if (existing) return existing;

    return Channel.create(this.client, data, this.guild);
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
   * @returns {?string}
   */
}

module.exports = GuildChannelStore;
