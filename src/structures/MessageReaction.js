const Emoji = require('./Emoji');
const ReactionEmoji = require('./ReactionEmoji');
const ReactionUserStore = require('../stores/ReactionUserStore');
const { Error } = require('../errors');

/**
 * Represents a reaction to a message.
 */
class MessageReaction {
  constructor(client, data, message) {
    /**
     * The message that this reaction refers to
     * @type {Message}
     */
    this.message = message;

    /**
     * Whether the client has given this reaction
     * @type {boolean}
     */
    this.me = data.me;

    /**
     * The number of people that have given the same reaction
     * @type {number}
     */
    this.count = data.count || 0;

    /**
     * The users that have given this reaction, mapped by their ID
     * @type {ReactionUserStore<Snowflake, User>}
     */
    this.users = new ReactionUserStore(client, undefined, this);

    this._emoji = new ReactionEmoji(this, data.emoji.name, data.emoji.id);
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
    const userID = this.message.client.users.resolveID(user);
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
