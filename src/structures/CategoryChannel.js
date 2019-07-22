'use strict';

const GuildChannel = require('./GuildChannel');
const GuildChannelStore = require('../stores/GuildChannelStore');

/**
 * Represents a guild category channel on Discord.
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {
  /**
   * Channels that are a part of this category
   * @type {?GuildChannelStore<Snowflake, GuildChannel>}
   * @readonly
   */
  get children() {
    const children = new GuildChannelStore(this.guild, this.guild.channels.filter(c => c.parentID === this.id).array());
    children._parent = this;
    return children;
  }

  /**
   * Sets the category parent of this channel.
   * <warn>It is not currently possible to set the parent of a CategoryChannel.</warn>
   * @method setParent
   * @memberof CategoryChannel
   * @instance
   * @param {?GuildChannel|Snowflake} channel Parent channel
   * @param {Object} [options={}] Options to pass
   * @param {boolean} [options.lockPermissions=true] Lock the permissions to what the parent's permissions are
   * @param {string} [options.reason] Reason for modifying the parent of this channel
   * @returns {Promise<GuildChannel>}
   */
}

module.exports = CategoryChannel;
