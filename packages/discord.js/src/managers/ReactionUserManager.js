'use strict';

const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { Error } = require('../errors');
const User = require('../structures/User');

/**
 * Manages API methods for users who reacted to a reaction and stores their cache.
 * @extends {CachedManager}
 */
class ReactionUserManager extends CachedManager {
  constructor(reaction, iterable) {
    super(reaction.client, User, iterable);

    /**
     * The reaction that this manager belongs to
     * @type {MessageReaction}
     */
    this.reaction = reaction;
  }

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, User>}
   * @name ReactionUserManager#cache
   */

  /**
   * Options used to fetch users who gave a reaction.
   * @typedef {Object} FetchReactionUsersOptions
   * @property {number} [limit=100] The maximum amount of users to fetch, defaults to `100`
   * @property {Snowflake} [after] Limit fetching users to those with an id greater than the supplied id
   */

  /**
   * Fetches all the users that gave this reaction. Resolves with a collection of users, mapped by their ids.
   * @param {FetchReactionUsersOptions} [options] Options for fetching the users
   * @returns {Promise<Collection<Snowflake, User>>}
   */
  async fetch({ limit = 100, after } = {}) {
    const message = this.reaction.message;
    const query = makeURLSearchParams({ limit, after });
    const data = await this.client.rest.get(
      Routes.channelMessageReaction(message.channelId, message.id, this.reaction.emoji.identifier),
      { query },
    );
    const users = new Collection();
    for (const rawUser of data) {
      const user = this.client.users._obtain(rawUser, this.reaction.message.guild);
      this.cache.set(user.id, user);
      users.set(user.id, user);
    }
    return users;
  }

  /**
   * Removes a user from this reaction.
   * @param {UserResolvable} [user=this.client.user] The user to remove the reaction of
   * @returns {Promise<MessageReaction>}
   */
  async remove(user = this.client.user) {
    const userId = this.client.users.resolveId(user);
    if (!userId) throw new Error('REACTION_RESOLVE_USER');
    const message = this.reaction.message;
    const route =
      userId === this.client.user.id
        ? Routes.channelMessageOwnReaction(message.channelId, message.id, this.reaction.emoji.identifier)
        : Routes.channelMessageUserReaction(message.channelId, message.id, this.reaction.emoji.identifier, userId);
    await this.client.rest.delete(route);
    return this.reaction;
  }
}

module.exports = ReactionUserManager;
