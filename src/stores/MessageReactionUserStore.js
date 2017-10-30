const DataStore = require('./DataStore');
let User;

/**
 * A data store to store User models who reacted to a MessageReaction.
 * @extends {DataStore}
 */
class MessageReactionUserStore extends DataStore {
  constructor(client, iterable, data) {
    if (!User) User = require('../structures/User');
    super(client, iterable, User);
    this.data = data;
  }

  create(data, cache) {
    return super.create(data, cache, { extras: [this.data.message] });
  }

  /**
   * Fetches all the users that gave this reaction. Resolves with a collection of users, mapped by their IDs.
   * @param {Object} [options] Options for fetching the users
   * @param {number} [options.limit=100] The maximum amount of users to fetch, defaults to 100
   * @param {Snowflake} [options.after] Limit fetching users to those with an id greater than the supplied id
   * @returns {Promise<Collection<Snowflake, User>>}
   */
  async fetch({ limit = 100, after } = {}) {
    const message = this.data.message;
    const reaction = message.reactions.get(this.data.emoji.id || this.data.emoji.name);
    const users = await message.client.api.channels[message.channel.id].messages[message.id]
      .reactions[this.data.emoji.identifier]
      .get({ query: { limit, after } });
    for (const rawUser of users) {
      const user = message.client.users.create(rawUser);
      reaction.users.set(user.id, user);
    }
    reaction.count = reaction.users.size;
    return reaction.users;
  }
}

module.exports = MessageReactionUserStore;
