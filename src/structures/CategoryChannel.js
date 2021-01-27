'use strict';

const ServerChannel = require('./ServerChannel');

/**
 * Represents a server category channel on Discord.
 * @extends {ServerChannel}
 */
class CategoryChannel extends ServerChannel {
  /**
   * Channels that are a part of this category
   * @type {Collection<Snowflake, ServerChannel>}
   * @readonly
   */
  get children() {
    return this.server.channels.cache.filter(c => c.parentID === this.id);
  }

  /**
   * Sets the category parent of this channel.
   * <warn>It is not currently possible to set the parent of a CategoryChannel.</warn>
   * @method setParent
   * @memberof CategoryChannel
   * @instance
   * @param {?ServerChannel|Snowflake} channel Parent channel
   * @param {Object} [options={}] Options to pass
   * @param {boolean} [options.lockPermissions=true] Lock the permissions to what the parent's permissions are
   * @param {string} [options.reason] Reason for modifying the parent of this channel
   * @returns {Promise<ServerChannel>}
   */
}

module.exports = CategoryChannel;
