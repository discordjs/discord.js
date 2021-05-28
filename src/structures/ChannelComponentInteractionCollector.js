'use strict';

const Collector = require('./interfaces/Collector');
const Collection = require('../util/Collection');
const { Events } = require('../util/Constants');

/**
 * Collects interaction on message buttons.
 * Will automatically stop if the message (`'messageDelete'`),
 * channel (`'channelDelete'`), or guild (`'guildDelete'`) are deleted.
 * @extends {Collector}
 */
class ChannelComponentInteractionCollector extends Collector {
  /**
   * @param {TextChannel|DMChannel|NewsChannel} channel The channel from which to collect button interactions
   * @param {CollectorFilter} filter The filter to apply to this collector
   * @param {ComponentInteractionCollectorOptions} [options={}] The options to apply to this collector
   */
  constructor(channel, filter, options = {}) {
    super(channel.client, filter, options);

    /**
     * The message upon which to collect button interactions
     * @type {TextChannel|DMChannel|NewsChannel}
     */
    this.channel = channel;

    /**
     * The users which have interacted to buttons on this message
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

    this.client.incrementMaxListeners();
    this.client.on(Events.INTERACTION_CREATE, this.handleCollect);
    this.client.on(Events.CHANNEL_DELETE, this._handleChannelDeletion);
    this.client.on(Events.GUILD_DELETE, this._handleGuildDeletion);

    this.once('end', () => {
      this.client.removeListener(Events.INTERACTION_CREATE, this.handleCollect);
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
     * @event ChannelComponentInteractionCollector#collect
     * @param {Interaction} interaction The interaction that was collected
     */
    if (!interaction.isComponent()) return null;

    if (interaction.channel.id !== this.channel.id) return null;

    return interaction.id;
  }

  /**
   * Handles an interaction for possible disposal.
   * @param {Interaction} interaction The interaction that could be disposed of
   * @returns {?Snowflake}
   */
  dispose(interaction) {
    /**
     * Emitted whenever an interaction is disposed of.
     * @event ChannelComponentInteractionCollector#dispose
     * @param {Interaction} interaction The interaction that was disposed of
     */
    if (!interaction.isComponent()) return null;

    return interaction.channel.id === this.channel.id ? interaction.id : null;
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

  get endReason() {
    if (this.options.max && this.total >= this.options.max) return 'limit';
    if (this.options.maxComponents && this.collected.size >= this.options.maxComponents) return 'componentLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return null;
  }

  /**
   * Handles checking if the channel has been deleted, and if so, stops the collector with the reason 'channelDelete'.
   * @private
   * @param {GuildChannel} channel The channel that was deleted
   * @returns {void}
   */
  _handleChannelDeletion(channel) {
    if (channel.id === this.message.channel.id) {
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
    if (this.message.guild && guild.id === this.message.guild.id) {
      this.stop('guildDelete');
    }
  }
}

module.exports = ChannelComponentInteractionCollector;
