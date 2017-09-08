const DataStore = require('./DataStore');
const { Presence } = require('../structures/Presence');

class PresenceStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, Presence);
  }

  create(data, cache) {
    const existing = this.get(data.user.id);
    return existing ? existing.patch(data) : super.create(data, cache);
  }

  /**
   * Data that can be resolved to a Presence object. This can be:
   * * A Presence
   * * A Snowflake
   * @typedef {Presence|Snowflake} PresenceResolvable
   */

  /**
	* Resolves a PresenceResolvable to a Presence object.
	* @method resolve
	* @memberof PresenceStore
    * @param {PresenceResolvable} presence The presence resolvable to resolve
    * @returns {?Presence}
    */

  /**
	* Resolves a PresenceResolvable to a Presence ID string.
	* @method resolveID
	* @memberof PresenceStore
    * @param {PresenceResolvable} presence The presence resolvable to resolve
    * @returns {?string}
    */
}

module.exports = PresenceStore;
