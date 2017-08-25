const DataStore = require('./DataStore');
const User = require('../structures/User');

/**
 * A data store to store User models.
 * @extends {DataStore}
 */
class UserStore extends DataStore {
  create(data) {
    const existing = this.get(data.id);
    if (existing) return existing;

    const user = new User(this.client, data);
    this.set(user.id, user);
    return user;
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

    return this.client.api.users(id).get().then(data =>
      cache ? this.create(data) : new User(this.client, data)
    );
  }
}

module.exports = UserStore;
