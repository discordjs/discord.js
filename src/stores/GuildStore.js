const DataStore = require('./DataStore');
const Guild = require('../structures/Guild');

/**
 * Stores guilds.
 * @private
 * @extends {DataStore}
 */
class GuildStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, Guild);
  }

  /**
   * Data that resolves to give a Guild object. This can be:
   * * A Guild object
   * * A Snowflake
   * @typedef {Guild|Snowflake} GuildResolvable
   */

  /**
   * Resolves a GuildResolvable to a Guild object.
   * @method resolve
   * @memberof GuildStore
   * @instance
   * @param {GuildResolvable} guild The guild resolvable to identify
   * @returns {?Guild}
   */

  /**
   * Resolves a GuildResolvable to a Guild ID string.
   * @method resolveID
   * @memberof GuildStore
   * @instance
   * @param {GuildResolvable} guild The guild resolvable to identify
   * @returns {?string}
   */
}

module.exports = GuildStore;
