const DataStore = require('./DataStore');
const Role = require('../structures/Role');

/**
 * Stores roles.
 * @private
 * @extends {DataStore}
 */
class RoleStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, Role);
    this.guild = guild;
  }

  create(data, cache) {
    return super.create(data, cache, { extras: [this.guild] });
  }

  /**
   * Data that can be resolved to a Role object. This can be:
   * * A Role
   * * A Snowflake
   * @typedef {Role|Snowflake} RoleResolvable
   */

  /**
    * Resolves a RoleResolvable to a Role object.
    * @method resolve
    * @memberof RoleStore
    * @instance
    * @param {RoleResolvable} role The role resolvable to resolve
    * @returns {?Role}
    */

  /**
    * Resolves a RoleResolvable to a role ID string.
    * @method resolveID
    * @memberof RoleStore
    * @instance
    * @param {RoleResolvable} role The role resolvable to resolve
    * @returns {?string}
    */
}

module.exports = RoleStore;
