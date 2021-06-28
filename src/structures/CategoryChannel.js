'use strict';

const GuildChannel = require('./GuildChannel');

/**
 * Represents a guild category channel on Discord.
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {
  /**
   * Channels that are a part of this category
   * @type {Collection<Snowflake, GuildChannel>}
   * @readonly
   */
  get children() {
    return this.guild.channels.cache.filter(c => c.parentID === this.id);
  }

  /**
   * When concatenated with a string, this automatically returns the channel's name instead of the Category object.
   * @returns {string}
   * @example
   * // Logs: Hello from General chit-chat !
   * console.log(`Hello from ${category}!`);
   */
  toString() {
    return this.name;
  }

  /**
   * Sets the category parent of this channel.
   * <warn>It is not currently possible to set the parent of a CategoryChannel.</warn>
   * @method setParent
   * @memberof CategoryChannel
   * @instance
   * @param {?(GuildChannel|Snowflake)} channel The channel to set as parent
   * @param {SetParentOptions} [options={}] The options for setting the parent
   * @returns {Promise<GuildChannel>}
   */
}

module.exports = CategoryChannel;
