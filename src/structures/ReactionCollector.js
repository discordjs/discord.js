const Collector = require('./interfaces/Collector');
const Collection = require('../util/Collection');

/**
 * @typedef {CollectorOptions} ReactionCollectorOptions
 * @property {number} max The maximum total amount of reactions to collect.
 * @property {number} maxEmojis The maximum number of emojis to collect.
 * @property {number} maxUsers The maximum number of users to react.
 */

/**
 * Collects reactions on messages.
 * @extends {Collector}
 */
class ReactionCollector extends Collector {

  /**
   * @param {Message} message The message upon which to collect reactions.
   * @param {CollectorFilter} filter The filter to apply to this collector.
   * @param {ReactionCollectorOptions} [options={}] The options to apply to this collector.
   */
  constructor(message, filter, options = {}) {
    super(message.client, filter, options);

    /**
     * The message.
     * @type {Message}
     */
    this.message = message;

    /**
     * Users which have reacted.
     * @type {Collection}
     */
    this.users = new Collection();

    /**
     * Total number of reactions collected.
     * @type {number}
     */
    this.total = 0;

    this.client.on('messageReactionAdd', this.listener);
  }

  handle(reaction) {
    if (reaction.message.id !== this.message.id) return null;
    return {
      key: reaction.emoji.id || reaction.emoji.name,
      value: reaction,
    };
  }

  postCheck(reaction, user) {
    this.users.set(user.id, user);
    if (this.options.max && ++this.total >= this.options.max) return 'limit';
    if (this.options.maxEmojis && this.collected.size >= this.options.maxEmojis) return 'emojiLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return null;
  }

  cleanup() {
    this.client.removeListener('messageReactionAdd', this.listener);
  }
}

module.exports = ReactionCollector;
