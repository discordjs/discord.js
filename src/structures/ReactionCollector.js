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

    this.client.on('messageReactionAdd', this.collect);
    this.client.on('messageReactionRemove', this.uncollect);
    this.client.on('messageReactionRemoveAll', this.empty);
  }

  /**
   * Handle an incoming reaction for possible collection.
   * @param {MessageReaction} reaction The reaction to possibly collect
   * @returns {?{key: Snowflake, value: MessageReaction}} Reaction data to collect
   * @private
   */
  shouldCollect(reaction) {
    if (reaction.message.id !== this.message.id) return null;
    return {
      key: ReactionCollector.key(reaction),
      value: reaction,
    };
  }

  /**
   * Handle a reaction deletion for possible uncollection.
   * @param {MessageReaction} reaction The reaction to possibly uncollect
   * @returns {?Snowflake|string} The reaction key
   */
  shouldUncollect(reaction) {
    return reaction.message.id === this.message.id ? ReactionCollector.key(reaction) : null;
  }

  /**
   * Empty this reaction collector.
   */
  empty() {
    this.total = 0;
    this.collected.clear();
    this.users.clear();
    this.checkShouldEnd();
  }

  /**
   * Maintain users collection for reaction additions.
   * @param {MessageReaction} reaction The reaction that was collected
   * @param {User} user The user that reacted
   */
  postCollect(reaction, user) {
    this.total++;
    this.users.set(user.id, user);
  }

  /**
   * Maintain users collection for reaction removals.
   * @param {MessageReaction} reaction The reaction that was removed
   * @param {User} user The user that removed their reaction
   */
  postUncollect(reaction, user) {
    this.total--;
    if (!this.collected.some(r => r.users.has(user.id))) this.users.delete(user.id);
  }

  shouldEnd() {
    if (this.options.max && this.total >= this.options.max) return 'limit';
    if (this.options.maxEmojis && this.collected.size >= this.options.maxEmojis) return 'emojiLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return null;
  }

  /**
   * Remove event listeners.
   * @private
   */
  cleanup() {
    this.client.removeListener('messageReactionAdd', this.collect);
    this.client.removeListener('messageReactionRemove', this.uncollect);
    this.client.removeListener('messageReactionRemoveAll', this.empty);
  }

  /**
   * Get the collector key for a reaction.
   * @param {MessageReaction} reaction The message reaction to get the key for
   * @returns {Snowflake|string} The emoji ID (if custom) or the emoji name (if native; will be unicode)
   */
  static key(reaction) {
    return reaction.emoji.id || reaction.emoji.name;
  }
}

module.exports = ReactionCollector;
