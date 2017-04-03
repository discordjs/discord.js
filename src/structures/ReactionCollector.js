const EventEmitter = require('events').EventEmitter;
const Collection = require('../util/Collection');

/**
 * Collects reactions on a message.
 * @extends {EventEmitter}
 */
class ReactionCollector extends EventEmitter {
  /**
   * Function that returns true when the reaction should be collected and false
   * when the reaction should not be collected.
   * @typedef {Function} ReactionCollectorFilter
   * @example
   * function filter(reaction, user, collector) {
   *   return reaction.emoji.name === '👌' && user.id === 'someID';
   * }
   */

  /**
   * @typedef {Object} ReactionCollectorOptions
   * @property {number} [time] The amount of time for which to collect reactions.
   * @property {number} [maxEmojis] Limit the total number of emojis.
   * @property {number} [maxUsers] Limit the total number of users.
   * @property {number} [max] Limit the total number of reactions.
   */

  /**
   * @param {Message} message The message to collect reactions on.
   * @param {ReactionCollectorFilter} filter The filter to apply to collected reactions.
   * @param {ReactionCollectorOptions} [options={}] Options for the reaction collector.
   */
  constructor(message, filter, options = {}) {
    super();

    /**
     * @type {Message} message The message upon which reactions are being collected.
     */
    this.message = message;

    /**
     * @type {ReactionCollectorFilter} filter The filter being applied to collected reactions.
     */
    this.filter = filter;

    /**
     * @type {ReactionCollectorOptions} options The options for this reaction collector.
     */
    this.options = options;

    /**
     * @type {boolean} ended Whether this collector is ended.
     */
    this.ended = false;

    /**
     * @type {Collection<string, MessageReaction>} collected The collected emojis,
     * keyed by ID for custom emojis and unicode for unicode emojis.
     */
    this.collected = new Collection();

    /**
     * @type {Collection<Snowflake, User>} users Users that reacted with collected emojis.
     */
    this.users = new Collection();

    /**
     * @type {number} total Total reactions collected.
     */
    this.total = 0;

    this.listener = (reaction, user) => this._verify(reaction, user);
    this.message.client.on('messageReactionAdd', this.listener);

    if (options.time) this.message.client.setTimeout(() => this.stop('time'), options.time);
  }

  /**
   * Filters and collects emojis.
   * @param {MessageReaction} reaction The reaction.
   * @param {User} user The user that reacted.
   * @private
   */
  _verify(reaction, user) {
    if (this.message.id !== reaction.message.id || !this.filter(reaction, user, this)) return;

    this.collected.set(reaction.emoji.id || reaction.emoji.name, reaction);
    this.users.set(user.id, user);
    /**
     * Emitted whenever the collector receives a message that passes the filter test.
     * @param {MessageReaction} reaction The received message.
     * @param {User} user The user that reacted.
     * @param {ReactionCollector} collector The collector that collected the reaction.
     * @event ReactionCollector#reaction
     */
    this.emit('reaction', reaction, user, this);

    if (this.options.max && ++this.total >= this.options.max) this.stop('limit');
    else if (this.options.maxEmojis && this.collected.size >= this.options.maxEmojis) this.stop('emojiLimit');
    else if (this.options.maxUsers && this.users.size >= this.options.maxUsers) this.stop('userLimit');
  }

  /**
   * Resolves upon next valid reaction; rejects on end.
   * @type {Promise<MessageReaction>}
   * @readonly
   */
  get next() {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        reject(this.collected);
        return;
      }

      const cleanup = () => {
        this.removeListener('reaction', onReaction);
        this.removeListener('end', onEnd);
      };

      const onReaction = reaction => {
        cleanup();
        resolve(reaction);
      };

      const onEnd = emojis => {
        cleanup();
        reject(emojis); // eslint-disable-line prefer-promise-reject-errors
      };

      this.on('reaction', onReaction);
      this.on('end', onEnd);
    });
  }

  /**
   * Stop the reaction collector and emits `end`.
   * @param {string} [reason='user'] Reason for ending the collector.  Passed to the `end` event.
   */
  stop(reason = 'user') {
    if (this.ended) return;
    this.ended = true;
    this.message.client.removeListener('messageReactionAdd', this.listener);

    /**
     * Emitted when the Collector stops collecting.
     * @param {Collection<string, MessageReaction>} collection A collection of reactions collected
     * during the lifetime of the collector, mapped by the ID of the reaction.
     * @param {string} reason The reason for the end of the collector. If it ended because it reached the specified time
     * limit, this would be `time`. If you invoke `.stop()` without specifying a reason, this would be `user`. If it
     * ended because an emoji hit its `max`, it will be `limit`; if it ended because the max number of emojis were used
     * to react, it will be `emojiLimit`; if it ended because the max number of users reacted, it will be `userLimit`.
     * @event ReactionCollector#end
     */
    this.emit('end', this.collected, reason);
  }
}

module.exports = ReactionCollector;
