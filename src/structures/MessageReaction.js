const Collection = require('../util/Collection');
const Emoji = require('./Emoji');
const ReactionEmoji = require('./ReactionEmoji');
const { Error } = require('../errors');

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
    const userID = this.message.client.resolver.resolveUserID(user);
    if (!userID) return Promise.reject(new Error('REACTION_RESOLVE_USER'));
    return this.message.client.api.channels[this.message.channel.id].messages[this.message.id]
      .reactions[this.emoji.identifier][userID === this.message.client.user.id ? '@me' : userID]
      .delete()
      .then(() =>
        this.message.client.actions.MessageReactionRemove.handle({
          user_id: userID,
          message_id: this.message.id,
          emoji: this.emoji,
          channel_id: this.message.channel.id,
        }).reaction
      );
  }

  /**
   * Fetch all the users that gave this reaction. Resolves with a collection of users, mapped by their IDs.
   * @param {number} [limit=100] The maximum amount of users to fetch, defaults to 100
   * @returns {Promise<Collection<Snowflake, User>>}
   */
  fetchUsers(limit = 100) {
    const message = this.message;
    return message.client.api.channels[message.channel.id].messages[message.id]
      .reactions[this.emoji.identifier]
      .get({ query: { limit } })
      .then(users => {
        this.users = new Collection();
        for (const rawUser of users) {
          const user = message.client.users.create(rawUser);
          this.users.set(user.id, user);
        }
        this.count = this.users.size;
        return this.users;
      });
  }

  _add(user) {
    if (!this.users.has(user.id)) {
      this.users.set(user.id, user);
      this.count++;
    }
    if (!this.me) this.me = user.id === this.message.client.user.id;
  }

  _remove(user) {
    if (this.users.has(user.id)) {
      this.users.delete(user.id);
      this.count--;
      if (user.id === this.message.client.user.id) this.me = false;
      if (this.count <= 0) {
        this.message.reactions.remove(this.emoji.id || this.emoji.name);
      }
    }
  }
}

module.exports = MessageReaction;
