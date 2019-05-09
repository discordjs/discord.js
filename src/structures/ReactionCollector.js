'use strict';

const Collector = require('./interfaces/Collector');
const Collection = require('../util/Collection');
const { Events } = require('../util/Constants');

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
     * The message upon which to collect reactions
     * @type {Message}
     */
    this.message = message;

    /**
     * The users which have reacted to this message
     * @type {Collection}
     */
    this.users = new Collection();

    /**
     * The total number of reactions collected
     * @type {number}
     */
    this.total = 0;

    this.empty = this.empty.bind(this);

    this.client.setMaxListeners(this.client.getMaxListeners() + 1);
    this.client.on(Events.MESSAGE_REACTION_ADD, this.handleCollect);
    this.client.on(Events.MESSAGE_REACTION_REMOVE, this.handleDispose);
    this.client.on(Events.MESSAGE_REACTION_REMOVE_ALL, this.empty);

    this.once('end', () => {
      this.client.removeListener(Events.MESSAGE_REACTION_ADD, this.handleCollect);
      this.client.removeListener(Events.MESSAGE_REACTION_REMOVE, this.handleDispose);
      this.client.removeListener(Events.MESSAGE_REACTION_REMOVE_ALL, this.empty);
      this.client.setMaxListeners(this.client.getMaxListeners() - 1);
    });

    this.on('collect', (reaction, user) => {
      this.total++;
      this.users.set(user.id, user);
    });

    this.on('remove', (reaction, user) => {
      this.total--;
      if (!this.collected.some(r => r.users.has(user.id))) this.users.delete(user.id);
    });
  }

  /**
   * Handles an incoming reaction for possible collection.
   * @param {MessageReaction} reaction The reaction to possibly collect
   * @returns {?Snowflake|string}
   * @private
   */
  collect(reaction) {
    /**
     * Emitted whenever a reaction is collected.
     * @event ReactionCollector#collect
     * @param {MessageReaction} reaction The reaction that was collected
     * @param {User} user The user that added the reaction
     */
    if (reaction.message.id !== this.message.id) return null;
    return ReactionCollector.key(reaction);
  }

  /**
   * Handles a reaction deletion for possible disposal.
   * @param {MessageReaction} reaction The reaction to possibly dispose of
   * @param {User} user The user that removed the reaction
   * @returns {?Snowflake|string}
   */
  dispose(reaction, user) {
    /**
     * Emitted whenever a reaction is disposed of.
     * @event ReactionCollector#dispose
     * @param {MessageReaction} reaction The reaction that was disposed of
     * @param {User} user The user that removed the reaction
     */
    if (reaction.message.id !== this.message.id) return null;

    /**
     * Emitted whenever a reaction is removed from a message. Will emit on all reaction removals,
     * as opposed to {@link Collector#dispose} which will only be emitted when the entire reaction
     * is removed.
     * @event ReactionCollector#remove
     * @param {MessageReaction} reaction The reaction that was removed
     * @param {User} user The user that removed the reaction
     */
    if (this.collected.has(ReactionCollector.key(reaction)) &&
        this.users.has(user.id)) {
      this.emit('remove', reaction, user);
    }
    return reaction.count ? null : ReactionCollector.key(reaction);
  }

  /**
   * Empties this reaction collector.
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
   * Gets the collector key for a reaction.
   * @param {MessageReaction} reaction The message reaction to get the key for
   * @returns {Snowflake|string}
   */
  static key(reaction) {
    return reaction.emoji.id || reaction.emoji.name;
  }
}

module.exports = ReactionCollector;
