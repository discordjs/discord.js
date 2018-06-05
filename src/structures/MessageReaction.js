const Collection = require('../util/Collection');
const Emoji = require('./Emoji');
const ReactionEmoji = require('./ReactionEmoji');

/**
 * Represents a reaction to a message.
 */
class MessageReaction {
  constructor(message, emoji, count, me) {
    /**
     * The message that this reaction refers to
     * @type {Message}
     */
    this.message = message;

    /**
     * Whether the client has given this reaction
     * @type {boolean}
     */
    this.me = me;

    /**
     * The number of people that have given the same reaction
     * @type {number}
     */
    this.count = count || 0;

    /**
     * The users that have given this reaction, mapped by their ID
     * @type {Collection<Snowflake, User>}
     */
    this.users = new Collection();

    this._emoji = new ReactionEmoji(this, emoji.name, emoji.id);
  }

  /**
   * The emoji of this reaction, either an Emoji object for known custom emojis, or a ReactionEmoji
   * object which has fewer properties. Whatever the prototype of the emoji, it will still have
   * `name`, `id`, `identifier` and `toString()`
   * @type {Emoji|ReactionEmoji}
   * @readonly
   */
  get emoji() {
    if (this._emoji instanceof Emoji) return this._emoji;
    // Check to see if the emoji has become known to the client
    if (this._emoji.id) {
      const emojis = this.message.client.emojis;
      if (emojis.has(this._emoji.id)) {
        const emoji = emojis.get(this._emoji.id);
        this._emoji = emoji;
        return emoji;
      }
    }
    return this._emoji;
  }

  /**
   * Removes a user from this reaction.
   * @param {UserResolvable} [user=this.message.client.user] The user to remove the reaction of
   * @returns {Promise<MessageReaction>}
   */
  remove(user = this.message.client.user) {
    const message = this.message;
    const userID = this.message.client.resolver.resolveUserID(user);
    if (!userID) return Promise.reject(new Error('Couldn\'t resolve the user ID to remove from the reaction.'));
    return message.client.rest.methods.removeMessageReaction(
      message, this.emoji.identifier, userID
    );
  }

  /**
   * Fetch all the users that gave this reaction. Resolves with a collection of users, mapped by their IDs.
   * @param {number} [limit=100] The maximum amount of users to fetch, defaults to 100
   * @param {Object} [options] Options to fetch users
   * @param {Snowflake} [options.before] Limit fetching users to those with an id lower than the supplied id
   * @param {Snowflake} [options.after] Limit fetching users to those with an id greater than the supplied id
   * @returns {Promise<Collection<Snowflake, User>>}
   */
  fetchUsers(limit = 100, { after, before } = {}) {
    const message = this.message;
    return message.client.rest.methods.getMessageReactionUsers(
      message, this.emoji.identifier, { after, before, limit }
    ).then(data => {
      const users = new Collection();
      for (const rawUser of data) {
        const user = this.message.client.dataManager.newUser(rawUser);
        this.users.set(user.id, user);
        users.set(user.id, user);
      }
      return users;
    });
  }
}

module.exports = MessageReaction;
