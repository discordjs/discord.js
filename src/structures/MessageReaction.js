const Collection = require('../util/Collection');
const Emoji = require('./Emoji');

/**
 * Represents a limited emoji set used for both custom and unicode emojis. Custom emojis
 * will use this class opposed to the Emoji class when the client doesn't know enough
 * information about them.
 */
class ReactionEmoji {
  constructor(reaction, name, id) {
    /**
     * The message reaction this emoji refers to
     * @type {MessageReaction}
     */
    this.reaction = reaction;
    /**
     * The name of this reaction emoji.
     * @type {string}
     */
    this.name = name;
    /**
     * The ID of this reaction emoji.
     * @type {string}
     */
    this.id = id;
  }

  /**
   * The identifier of this emoji, used for message reactions
   * @readonly
   * @type {string}
   */
  get identifier() {
    if (this.id) {
      return `${this.name}:${this.id}`;
    }
    return encodeURIComponent(this.name);
  }

  /**
   * Creates the text required to form a graphical emoji on Discord.
   * @example
   * ```js
   * // send the emoji used in a reaction to the channel the reaction is part of
   * reaction.message.channel.sendMessage(`The emoji used is ${reaction.emoji}`);
   * ```
   * @returns {string}
   */
  toString() {
    return this.id ? `<:${this.name}:${this.id}>` : this.name;
  }
}

/**
 * Represents a reaction to a message
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
    this._emoji = new ReactionEmoji(this, emoji.name, emoji.id);
    /**
     * The number of people that have given the same reaction.
     * @type {number}
     */
    this.count = count || 0;
    /**
     * The users that have given this reaction, mapped by their ID.
     * @type {Collection<string, User>}
     */
    this.users = new Collection();
  }

  /**
   * The emoji of this reaction, either an Emoji object for known custom emojis, or a ReactionEmoji which has fewer
   * properties. Whatever the prototype of the emoji, it will still have `name`, `id`, `identifier` and `toString()`
   * @type {Emoji|ReactionEmoji}
   */
  get emoji() {
    if (this._emoji instanceof Emoji) {
      return this._emoji;
    }
    // check to see if the emoji has become known to the client
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
   * If the client has given this reaction to a message, it is removed.
   * @returns {Promise<MessageReaction>}
   */
  remove() {
    const message = this.message;
    return message.client.rest.methods.removeMessageReaction(message.channel.id, message.id, this.emoji.identifier);
  }

  /**
   * Fetch all the users that gave this reaction. Resolves with a collection of users,
   * mapped by their IDs.
   * @returns {Promise<Collection<string, User>>}
   */
  fetchUsers() {
    const message = this.message;
    return new Promise((resolve, reject) => {
      message.client.rest.methods.getMessageReactionUsers(message.channel.id, message.id, this.emoji.identifier)
      .then(users => {
        this.users = new Collection();
        for (const rawUser of users) {
          const user = this.message.client.dataManager.newUser(rawUser);
          this.users.set(user.id, user);
        }
        this.count = this.users.size;
        resolve(this.users);
      })
      .catch(reject);
    });
  }
}

module.exports = MessageReaction;
