'use strict';

const { Collection } = require('@discordjs/collection');
const Collector = require('./interfaces/Collector');
const Events = require('../util/Events');

/**
 * @typedef {CollectorOptions} ReactionCollectorOptions
 * @property {number} max The maximum total amount of reactions to collect
 * @property {number} maxEmojis The maximum number of emojis to collect
 * @property {number} maxUsers The maximum number of users to react
 */

/**
 * Collects reactions on messages.
 * Will automatically stop if the message ({@link Client#event:messageDelete messageDelete} or
 * {@link Client#event:messageDeleteBulk messageDeleteBulk}),
 * channel ({@link Client#event:channelDelete channelDelete}),
 * thread ({@link Client#event:threadDelete threadDelete}), or
 * guild ({@link Client#event:guildDelete guildDelete}) is deleted.
 * @extends {Collector}
 */
class ReactionCollector extends Collector {
  /**
   * @param {Message} message The message upon which to collect reactions
   * @param {ReactionCollectorOptions} [options={}] The options to apply to this collector
   */
  constructor(message, options = {}) {
    super(message.client, options);

    /**
     * The message upon which to collect reactions
     * @type {Message}
     */
    this.message = message;

    /**
     * The users that have reacted to this message
     * @type {Collection}
     */
    this.users = new Collection();

    /**
     * The total number of reactions collected
     * @type {number}
     */
    this.total = 0;

    this.empty = this.empty.bind(this);
    this._handleChannelDeletion = this._handleChannelDeletion.bind(this);
    this._handleThreadDeletion = this._handleThreadDeletion.bind(this);
    this._handleGuildDeletion = this._handleGuildDeletion.bind(this);
    this._handleMessageDeletion = this._handleMessageDeletion.bind(this);

    const bulkDeleteListener = messages => {
      if (messages.has(this.message.id)) this.stop('messageDelete');
    };

    this.client.incrementMaxListeners();
    this.client.on(Events.MessageReactionAdd, this.handleCollect);
    this.client.on(Events.MessageReactionRemove, this.handleDispose);
    this.client.on(Events.MessageReactionRemoveAll, this.empty);
    this.client.on(Events.MessageDelete, this._handleMessageDeletion);
    this.client.on(Events.MessageBulkDelete, bulkDeleteListener);
    this.client.on(Events.ChannelDelete, this._handleChannelDeletion);
    this.client.on(Events.ThreadDelete, this._handleThreadDeletion);
    this.client.on(Events.GuildDelete, this._handleGuildDeletion);

    this.once('end', () => {
      this.client.removeListener(Events.MessageReactionAdd, this.handleCollect);
      this.client.removeListener(Events.MessageReactionRemove, this.handleDispose);
      this.client.removeListener(Events.MessageReactionRemoveAll, this.empty);
      this.client.removeListener(Events.MessageDelete, this._handleMessageDeletion);
      this.client.removeListener(Events.MessageBulkDelete, bulkDeleteListener);
      this.client.removeListener(Events.ChannelDelete, this._handleChannelDeletion);
      this.client.removeListener(Events.ThreadDelete, this._handleThreadDeletion);
      this.client.removeListener(Events.GuildDelete, this._handleGuildDeletion);
      this.client.decrementMaxListeners();
    });

    this.on('collect', (reaction, user) => {
      /**
       * Emitted whenever a reaction is newly created on a message. Will emit only when a new reaction is
       * added to the message, as opposed to {@link Collector#collect} which will
       * be emitted even when a reaction has already been added to the message.
       * @event ReactionCollector#create
       * @param {MessageReaction} reaction The reaction that was added
       * @param {User} user The user that added the reaction
       */
      if (reaction.count === 1) {
        this.emit('create', reaction, user);
      }
      this.total++;
      this.users.set(user.id, user);
    });

    this.on('remove', (reaction, user) => {
      this.total--;
      if (!this.collected.some(r => r.users.cache.has(user.id))) this.users.delete(user.id);
    });
  }

  /**
   * Handles an incoming reaction for possible collection.
   * @param {MessageReaction} reaction The reaction to possibly collect
   * @param {User} user The user that added the reaction
   * @returns {?(Snowflake|string)}
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
   * @returns {?(Snowflake|string)}
   */
  dispose(reaction, user) {
    /**
     * Emitted when the reaction had all the users removed and the `dispose` option is set to true.
     * @event ReactionCollector#dispose
     * @param {MessageReaction} reaction The reaction that was disposed of
     * @param {User} user The user that removed the reaction
     */
    if (reaction.message.id !== this.message.id) return null;

    /**
     * Emitted when the reaction had one user removed and the `dispose` option is set to true.
     * @event ReactionCollector#remove
     * @param {MessageReaction} reaction The reaction that was removed
     * @param {User} user The user that removed the reaction
     */
    if (this.collected.has(ReactionCollector.key(reaction)) && this.users.has(user.id)) {
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

  /**
   * The reason this collector has ended with, or null if it hasn't ended yet
   * @type {?string}
   * @readonly
   */
  get endReason() {
    if (this.options.max && this.total >= this.options.max) return 'limit';
    if (this.options.maxEmojis && this.collected.size >= this.options.maxEmojis) return 'emojiLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return super.endReason;
  }

  /**
   * Handles checking if the message has been deleted, and if so, stops the collector with the reason 'messageDelete'.
   * @private
   * @param {Message} message The message that was deleted
   * @returns {void}
   */
  _handleMessageDeletion(message) {
    if (message.id === this.message.id) {
      this.stop('messageDelete');
    }
  }

  /**
   * Handles checking if the channel has been deleted, and if so, stops the collector with the reason 'channelDelete'.
   * @private
   * @param {GuildChannel} channel The channel that was deleted
   * @returns {void}
   */
  _handleChannelDeletion(channel) {
    if (channel.id === this.message.channelId || channel.threads?.cache.has(this.message.channelId)) {
      this.stop('channelDelete');
    }
  }

  /**
   * Handles checking if the thread has been deleted, and if so, stops the collector with the reason 'threadDelete'.
   * @private
   * @param {ThreadChannel} thread The thread that was deleted
   * @returns {void}
   */
  _handleThreadDeletion(thread) {
    if (thread.id === this.message.channelId) {
      this.stop('threadDelete');
    }
  }

  /**
   * Handles checking if the guild has been deleted, and if so, stops the collector with the reason 'guildDelete'.
   * @private
   * @param {Guild} guild The guild that was deleted
   * @returns {void}
   */
  _handleGuildDeletion(guild) {
    if (guild.id === this.message.guild?.id) {
      this.stop('guildDelete');
    }
  }

  /**
   * Gets the collector key for a reaction.
   * @param {MessageReaction} reaction The message reaction to get the key for
   * @returns {Snowflake|string}
   */
  static key(reaction) {
    return reaction.emoji.id ?? reaction.emoji.name;
  }
}

module.exports = ReactionCollector;
