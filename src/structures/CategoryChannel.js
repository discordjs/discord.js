/**
 * Represents a guild category channel on Discord.
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {
  /**
   * Channels that are part of this category
   * @type {?Collection<Snowflake, GuildChannel>}
   * @readonly
   */
  get children() {
    return this.guild.channels.filter(c => c.parentID === this.id);
  }
}

module.exports = CategoryChannel;

const { GuildChannel } = require('../');
