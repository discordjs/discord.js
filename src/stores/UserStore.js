const DataStore = require('./DataStore');
const User = require('../structures/User');

/**
 * A data store to store User models.
 * @extends {DataStore}
 */
class UserStore extends DataStore {
  constructor(...args) {
    super(...args);
    Object.defineProperty(this, 'holds', { value: User });
  }

  /**
   * Obtains a user from Discord, or the user cache if it's already available.
   * <warn>This is only available when using a bot account.</warn>
   * @param {Snowflake} id ID of the user
   * @param {boolean} [cache=true] Whether to cache the new user object if it isn't already
   * @returns {Promise<User>}
   */
  fetch(id, cache = true) {
    const existing = this.get(id);
    if (existing) return Promise.resolve(existing);

    return this.client.api.users(id).get().then(data => this.create(data, cache));
  }
}

module.exports = UserStore;
