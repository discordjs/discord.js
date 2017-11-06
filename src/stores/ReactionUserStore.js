const DataStore = require('./DataStore');
/**
 * A data store to store User models who reacted to a MessageReaction.
 * @extends {DataStore}
 */
class ReactionUserStore extends DataStore {
  constructor(client, iterable, reaction) {
    super(client, iterable, require('../structures/User'));
    this.reaction = reaction;
  }

  /**
   * Fetches all the users that gave this reaction. Resolves with a collection of users, mapped by their IDs.
   * @param {Object} [options] Options for fetching the users
   * @param {number} [options.limit=100] The maximum amount of users to fetch, defaults to 100
   * @param {Snowflake} [options.before] Limit fetching users to those with an id lower than the supplied id
   * @param {Snowflake} [options.after] Limit fetching users to those with an id greater than the supplied id
   * @returns {Promise<ReactionUserStore<Snowflake, User>>}
   */
  async fetch({ limit = 100, after, before } = {}) {
    const message = this.reaction.message;
    const users = await this.client.api.channels[message.channel.id].messages[message.id]
      .reactions[this.reaction.emoji.identifier]
      .get({ query: { limit, before, after } });
    for (const rawUser of users) {
      const user = this.client.users.create(rawUser);
      this.set(user.id, user);
    }
    return this;
  }
}

module.exports = ReactionUserStore;
