const DataStore = require('./DataStore');
const { Presence } = require('../structures/Presence');

/**
 * Stores presences.
 * @private
 * @extends {DataStore}
 */
class PresenceStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, Presence);
  }

  create(data, cache) {
    const existing = this.get(data.user.id);
    return existing ? existing.patch(data) : super.create(data, cache, { id: data.user.id });
  }

  /**
   * Data that can be resolved to a Presence object. This can be:
   * * A Presence
   * * A UserResolveable
   * * A Snowflake
   * @typedef {Presence|UserResolveable|Snowflake} PresenceResolvable
   */

  /**
    * Resolves a PresenceResolvable to a Presence object.
    * @param {PresenceResolvable} presence The presence resolvable to resolve
    * @returns {?Presence}
    */
  resolve(presence) {
    const presenceResolveable = super.resolve(presence);
    if (presenceResolveable) return presenceResolveable;
    const UserResolveable = this.client.users.resolveID(presence);
    return super.resolve(UserResolveable) || null;
  }

  /**
    * Resolves a PresenceResolvable to a Presence ID string.
    * @param {PresenceResolvable} presence The presence resolvable to resolve
    * @returns {?string}
    */
  resolveID(presence) {
    const presenceResolveable = super.resolveID(presence);
    if (presenceResolveable) return presenceResolveable;
    const userResolveable = this.client.users.resolveID(presence);
    return this.has(userResolveable) ? userResolveable : null;
  }
}

module.exports = PresenceStore;
