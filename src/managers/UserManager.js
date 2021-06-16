'use strict';

const BaseManager = require('./BaseManager');
const GuildMember = require('../structures/GuildMember');
const Message = require('../structures/Message');
const { USERS_PATTERN } = require('../structures/MessageMentions');
const User = require('../structures/User');

/**
 * Manages API methods for users and stores their cache.
 * @extends {BaseManager}
 */
class UserManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, User);
  }

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, User>}
   * @name UserManager#cache
   */

  /**
   * Data that resolves to give a User object. This can be:
   * * A User object
   * * A Snowflake
   * * A Message object (resolves to the message author)
   * * A GuildMember object
   * * A User Mention string
   * @typedef {User|Snowflake|Message|GuildMember|string} UserResolvable
   */

  /**
   * Resolves a UserResolvable to a User object.
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?User}
   */
  resolve(user) {
    if (user instanceof GuildMember) return user.user;
    else if (user instanceof Message) return user.author;
    else if (typeof user === 'string') user = user.match(USERS_PATTERN)[1];
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
    else if (typeof user === 'string') return user.match(USERS_PATTERN)[1];
    return super.resolveID(user);
  }

  /**
   * Obtains a user from Discord, or the user cache if it's already available.
   * @param {Snowflake} id ID of the user
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<User>}
   */
  async fetch(id, { cache = true, force = false } = {}) {
    if (!force) {
      const existing = this.cache.get(id);
      if (existing && !existing.partial) return existing;
    }

    const data = await this.client.api.users(id).get();
    return this.add(data, cache);
  }
}

module.exports = UserManager;
