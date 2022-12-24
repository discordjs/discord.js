'use strict';

const GuildChannel = require('./GuildChannel');
const CategoryChannelChildManager = require('../managers/CategoryChannelChildManager');

/**
 * Represents a guild category channel on Discord.
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {
  /**
   * Sets the category parent of this channel.
   * <warn>It is not currently possible to set the parent of a CategoryChannel.</warn>
   * @method setParent
   * @memberof CategoryChannel
   * @instance
   * @param {?CategoryChannelResolvable} channel The channel to set as parent
   * @param {SetParentOptions} [options={}] The options for setting the parent
   * @returns {Promise<GuildChannel>}
   */

  /**
   * A manager of the channels belonging to this category
   * @type {CategoryChannelChildManager}
   * @readonly
   */
  get children() {
    return new CategoryChannelChildManager(this);
  }
}

module.exports = CategoryChannel;
