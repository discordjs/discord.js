'use strict';

const Collector = require('./interfaces/Collector');
const Collection = require('../util/Collection');
const { Events } = require('../util/Constants');

/**
 * @typedef {CollectorOptions} MessageComponentInteractionCollectorOptions
 * @property {number} max The maximum total amount of interactions to collect
 * @property {number} maxComponents The maximum number of components to collect
 * @property {number} maxUsers The maximum number of users to interact
 */

/**
 * Collects interaction on message components.
 * Will automatically stop if the message (`'messageDelete'`),
 * channel (`'channelDelete'`), or guild (`'guildDelete'`) are deleted.
 * @extends {Collector}
 */
class MessageComponentInteractionCollector extends Collector {
  /**
   * @param {Message|TextChannel|DMChannel|NewsChannel} source
   * The source from which to collect message component interactions
   * @param {CollectorFilter} filter The filter to apply to this collector
   * @param {MessageComponentInteractionCollectorOptions} [options={}] The options to apply to this collector
   */
  constructor(source, filter, options = {}) {
    super(source.client, filter, options);

    /**
     * The message from which to collect message component interactions, if provided
     * @type {?Message}
     */
    this.message = source instanceof require('./Message') ? source : null;

    /**
     * The source channel from which to collect message component interactions
     * @type {TextChannel|DMChannel|NewsChannel}
     */
    this.channel = this.message ? this.message.channel : source;

    /**
     * The users which have interacted to components on this collector
     * @type {Collection}
     */
    this.users = new Collection();

    /**
     * The total number of interactions collected
     * @type {number}
     */
    this.total = 0;

    this.empty = this.empty.bind(this);
    this._handleChannelDeletion = this._handleChannelDeletion.bind(this);
    this._handleGuildDeletion = this._handleGuildDeletion.bind(this);
    this._handleMessageDeletion = this._handleMessageDeletion.bind(this);

    this.client.incrementMaxListeners();
    this.client.on(Events.INTERACTION_CREATE, this.handleCollect);

    if (this.message) this.client.on(Events.MESSAGE_DELETE, this._handleMessageDeletion);

    this.client.on(Events.CHANNEL_DELETE, this._handleChannelDeletion);
    this.client.on(Events.GUILD_DELETE, this._handleGuildDeletion);

    this.once('end', () => {
      this.client.removeListener(Events.INTERACTION_CREATE, this.handleCollect);

      if (this.message) this.client.removeListener(Events.MESSAGE_DELETE, this._handleMessageDeletion);

      this.client.removeListener(Events.CHANNEL_DELETE, this._handleChannelDeletion);
      this.client.removeListener(Events.GUILD_DELETE, this._handleGuildDeletion);
      this.client.decrementMaxListeners();
    });

    this.on('collect', interaction => {
      this.total++;
      this.users.set(interaction.user.id, interaction.user);
    });
  }

  /**
   * Handles an incoming interaction for possible collection.
   * @param {Interaction} interaction The interaction to possibly collect
   * @returns {?Snowflake|string}
   * @private
   */
  collect(interaction) {
    /**
     * Emitted whenever a interaction is collected.
     * @event MessageComponentInteractionCollector#collect
     * @param {Interaction} interaction The interaction that was collected
     */
    if (!interaction.isMessageComponent()) return null;

    if (this.message) {
      return interaction.message.id === this.message.id ? interaction.id : null;
    }

    return interaction.channel.id === this.channel.id ? interaction.id : null;
  }

  /**
   * Handles an interaction for possible disposal.
   * @param {Interaction} interaction The interaction that could be disposed of
   * @returns {?Snowflake}
   */
  dispose(interaction) {
    /**
     * Emitted whenever an interaction is disposed of.
     * @event MessageComponentInteractionCollector#dispose
     * @param {Interaction} interaction The interaction that was disposed of
     */
    if (!interaction.isMessageComponent()) return null;

    if (this.message) {
      return interaction.message.id === this.message.id ? interaction.id : null;
    }

    return interaction.channel.id === this.channel.id ? interaction.id : null;
  }

  /**
   * Empties this message component collector.
   */
  empty() {
    this.total = 0;
    this.collected.clear();
    this.users.clear();
    this.checkEnd();
  }

  get endReason() {
    if (this.options.max && this.total >= this.options.max) return 'limit';
    if (this.options.maxComponents && this.collected.size >= this.options.maxComponents) return 'componentLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return null;
  }

  /**
   * Handles checking if the message has been deleted, and if so, stops the collector with the reason 'messageDelete'.
   * @private
   * @param {Message} message The message that was deleted
   * @returns {void}
   */
  _handleMessageDeletion(message) {
    if (message.id === this.message?.id) {
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
    if (channel.id === this.channel.id) {
      this.stop('channelDelete');
    }
  }

  /**
   * Handles checking if the guild has been deleted, and if so, stops the collector with the reason 'guildDelete'.
   * @private
   * @param {Guild} guild The guild that was deleted
   * @returns {void}
   */
  _handleGuildDeletion(guild) {
    if (guild.id === this.channel.guild?.id) {
      this.stop('guildDelete');
    }
  }
}

module.exports = MessageComponentInteractionCollector;
