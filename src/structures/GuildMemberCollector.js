'use strict';

const Collector = require('./interfaces/Collector');
const { Events } = require('../util/Constants');

/**
 * @typedef {CollectorOptions} GuildMemberCollectorOptions
 * @property {number} max The maximum amount of guild members to collect
 * @property {number} maxJoined The maximum amount of guild members that should join
 */

/**
  * Collects guild members in a guild.
  * @extends {Collector}
  */
class GuildMemberCollector extends Collector {
  /**
   * @param {Guild} guild The guild
   * @param {CollectorFilter} filter The filter to be appleid to this collector
   * @param {GuildMemberCollectorOptions} options The options to be applied to this collector
   */
  constructor(guild, filter, options = {}) {
    super(guild.client, filter, options);

    /**
     * The guild upon which to collect joins
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The total number of members that joined the guild
     * @type {number}
     */
    this.joined = 0;

    this._handleGuildDeletion = this._handleGuildDeletion.bind(this);

    const chunkListener = (members => {
      for (const member of members.values()) this.handleDispose(member);
    }).bind(this);

    if (this.client.getMaxListeners() !== 0) this.client.setMaxListeners(this.client.getMaxListeners() + 1);
    this.client.on(Events.GUILD_MEMBER_ADD, this.handleCollect);
    this.client.on(Events.GUILD_MEMBER_REMOVE, this.handleDispose);
    this.client.on(Events.GUILD_DELETE, this._handleGuildDeletion);
    this.client.on(Events.GUILD_MEMBERS_CHUNK, chunkListener);

    this.once('end', () => {
      this.client.removeListener(Events.GUILD_MEMBER_ADD, this.handleCollect);
      this.client.removeListener(Events.GUILD_MEMBER_REMOVE, this.handleDispose);
      this.client.removeListener(Events.GUILD_DELETE, this._handleGuildDeletion);
      this.client.removeListener(Events.GUILD_MEMBERS_CHUNK, chunkListener);
      if (this.client.getMaxListeners() !== 0) this.client.setMaxListeners(this.client.getMaxListeners() - 1);
    });
  }

  /**
   * Handles a member for possible collection.
   * @param {GuildMember} member The member that joined
   * @returns {?Snowflake}
   * @private
   */
  collect(member) {
    /**
     * Emitted whenever a member joins the guild.
     * @event GuildMemberCollector#collect
     * @param {GuildMember} member The member that joined
     */
    if (member.guild.id !== this.guild.id) return null;
    this.joined++;
    return member.id;
  }

  /**
   * Handles a member for possible disposal.
   * @param {GuildMember} member The member that could be disposed of
   * @returns {?Snowflake}
   */
  dispose(member) {
    /**
     * Emitted whenever a member is disposed of.
     * @event GuildMemberCollector#dispose
     * @param {GuildMember} member The member that was disposed of
     */
    return member.guild.id === this.guild.id ? member.id : null;
  }

  /**
   * Checks after un/collecting to see if the collector is done.
   * @returns {?string}
   * @private
   */
  endReason() {
    if (this.options.max && this.collected.size > this.options.max) return 'limit';
    if (this.options.maxJoined && this.joined > this.options.maxJoined) return 'joinedLimit';
    return null;
  }

  /**
   * Handles checking if the Guild has been deleted, and if so, stops the Collector with a reason of `guildDelete`.
   * @private
   * @param {Guild} guild The guild that was deleted
   * @returns {void}
   */
  _handleGuildDeletion(guild) {
    if (this.guild.id === guild.id) {
      this.stop('guildDelete');
    }
  }
}

module.exports = GuildMemberCollector;
