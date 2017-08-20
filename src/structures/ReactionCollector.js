const Collector = require('./interfaces/Collector');
const Collection = require('../util/Collection');

/**
 * @typedef {CollectorOptions} ReactionCollectorOptions
 * @property {number} max The maximum total amount of reactions to collect
 * @property {number} maxEmojis The maximum number of emojis to collect
 * @property {number} maxUsers The maximum number of users to react
 */

/**
 * Collects reactions on messages.
 * @extends {Collector}
 */
class ReactionCollector extends Collector {
  /**
   * @param {Message} message The message upon which to collect reactions
   * @param {CollectorFilter} filter The filter to apply to this collector
   * @param {ReactionCollectorOptions} [options={}] The options to apply to this collector
   */
  constructor(message, filter, options = {}) {
    super(message.client, filter, options);

    /**
     * The message
     * @type {Message}
     */
    this.message = message;

    /**
     * The users which have reacted
     * @type {Collection}
     */
    this.users = new Collection();

    /**
     * The total number of reactions collected
     * @type {number}
     */
    this.total = 0;

    this.empty = this.empty.bind(this);

    this.client.on('messageReactionAdd', this.handleCollect);
    this.client.on('messageReactionRemove', this.handleDispose);
    this.client.on('messageReactionRemoveAll', this.empty);

    this.once('end', () => {
      this.client.removeListener('messageReactionAdd', this.handleCollect);
      this.client.removeListener('messageReactionRemove', this.handleDispose);
      this.client.removeListener('messageReactionRemoveAll', this.empty);
    });

    this.on('collect', (collected, reaction, user) => {
      this.total++;
      this.users.set(user.id, user);
    });

    this.on('dispose', (disposed, reaction, user) => {
      this.total--;
      if (!this.collected.some(r => r.users.has(user.id))) this.users.delete(user.id);
    });
  }

  /**
   * Handle an incoming reaction for possible collection.
   * @param {MessageReaction} reaction The reaction to possibly collect
   * @returns {?{key: Snowflake, value: MessageReaction}}
   * @private
   */
  collect(reaction) {
    if (reaction.message.id !== this.message.id) return null;
    return {
      key: ReactionCollector.key(reaction),
      value: reaction,
    };
  }

  /**
   * Handle a reaction deletion for possible disposal.
   * @param {MessageReaction} reaction The reaction to possibly dispose
   * @returns {?Snowflake|string}
   */
  dispose(reaction) {
    return reaction.message.id === this.message.id && !reaction.count ? ReactionCollector.key(reaction) : null;
  }

  /**
   * Empty this reaction collector.
   */
  empty() {
    this.total = 0;
    this.collected.clear();
    this.users.clear();
    this.checkEnd();
  }

  endReason() {
    if (this.options.max && this.total >= this.options.max) return 'limit';
    if (this.options.maxEmojis && this.collected.size >= this.options.maxEmojis) return 'emojiLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return null;
  }

  /**
   * Get the collector key for a reaction.
   * @param {MessageReaction} reaction The message reaction to get the key for
   * @returns {Snowflake|string}
   */
  static key(reaction) {
    return reaction.emoji.id || reaction.emoji.name;
  }
}

module.exports = ReactionCollector;
