'use strict';

const DataStore = require('./DataStore');
const User = require('../structures/User');
const GuildMember = require('../structures/GuildMember');
const Message = require('../structures/Message');

/**
 * A data store to store User models.
 * @extends {DataStore}
 */
class UserStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, User);
  }

  /**
   * Data that resolves to give a User object. This can be:
   * * A User object
   * * A Snowflake
   * * A Message object (resolves to the message author)
   * * A GuildMember object
   * @typedef {User|Snowflake|Message|GuildMember} UserResolvable
   */

  /**
   * Resolves a UserResolvable to a User object.
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?User}
   */
  resolve(user) {
    if (user instanceof GuildMember) return user.user;
    if (user instanceof Message) return user.author;
    return super.resolve(user);
  }

  /**
   * Resolves a UserResolvable to a user ID string.
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?Snowflake}
   */
  resolveID(user) {
    if (user instanceof GuildMember) return user.user.id;
    if (user instanceof Message) return user.author.id;
    return super.resolveID(user);
  }

  /**
   * Obtains a user from Discord, or the user cache if it's already available.
   * @param {Snowflake} id ID of the user
   * @param {boolean} [cache=true] Whether to cache the new user object if it isn't already
   * @returns {Promise<User>}
   */
  fetch(id, cache = true) {
    const existing = this.get(id);
    if (existing) return Promise.resolve(existing);

    return this.client.api.users(id).get().then(data => this.add(data, cache));
  }
}

module.exports = UserStore;
