const Collection = require('../util/Collection');
const DataStore = require('./DataStore');
const { Error } = require('../errors');

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
   * @returns {Promise<Collection<Snowflake, User>>}
   */
  async fetch({ limit = 100, after, before } = {}) {
    const message = this.reaction.message;
    const data = await this.client.api.channels[message.channel.id].messages[message.id]
      .reactions[this.reaction.emoji.identifier]
      .get({ query: { limit, before, after } });
    const users = new Collection();
    for (const rawUser of data) {
      const user = this.client.users.add(rawUser);
      this.set(user.id, user);
      users.set(user.id, user);
    }
    return users;
  }

  /**
   * Removes a user from this reaction.
   * @param {UserResolvable} [user=this.reaction.message.client.user] The user to remove the reaction of
   * @returns {Promise<MessageReaction>}
   */
  remove(user = this.reaction.message.client.user) {
    const message = this.reaction.message;
    const userID = message.client.users.resolveID(user);
    if (!userID) return Promise.reject(new Error('REACTION_RESOLVE_USER'));
    return message.client.api.channels[message.channel.id].messages[message.id]
      .reactions[this.reaction.emoji.identifier][userID === message.client.user.id ? '@me' : userID]
      .delete()
      .then(() =>
        message.client.actions.MessageReactionRemove.handle({
          user_id: userID,
          message_id: message.id,
          emoji: this.reaction.emoji,
          channel_id: message.channel.id,
        }).reaction
      );
  }
}

module.exports = ReactionUserStore;
