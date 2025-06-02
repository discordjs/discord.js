'use strict';

const { CategoryChannelChildManager } = require('../managers/CategoryChannelChildManager.js');
const { GuildChannel } = require('./GuildChannel.js');

/**
 * Represents a guild category channel on Discord.
 *
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {
  /**
   * The id of the parent of this channel.
   *
   * @name CategoryChannel#parentId
   * @type {null}
   */

  /**
   * The parent of this channel.
   *
   * @name CategoryChannel#parent
   * @type {null}
   * @readonly
   */

  /**
   * Sets the category parent of this channel.
   * <warn>It is not possible to set the parent of a CategoryChannel.</warn>
   *
   * @method setParent
   * @memberof CategoryChannel
   * @instance
   * @param {?CategoryChannelResolvable} channel The channel to set as parent
   * @param {SetParentOptions} [options={}] The options for setting the parent
   * @returns {Promise<GuildChannel>}
   */

  /**
   * A manager of the channels belonging to this category
   *
   * @type {CategoryChannelChildManager}
   * @readonly
   */
  get children() {
    return new CategoryChannelChildManager(this);
  }
}

exports.CategoryChannel = CategoryChannel;
