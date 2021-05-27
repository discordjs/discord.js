'use strict';

const GuildChannel = require('./GuildChannel');

/**
 * Represents a guild store channel on Discord.
 * @extends {GuildChannel}
 */
class StoreChannel extends GuildChannel {
  /**
   * @param {*} guild The guild the store channel is part of
   * @param {*} data The data for the store channel
   */
  constructor(guild, data) {
    super(guild, data);

    /**
     * If the guild considers this channel NSFW
     * @type {boolean}
     * @readonly
     */
    this.nsfw = Boolean(data.nsfw);
  }

  _patch(data) {
    super._patch(data);

    if (typeof data.nsfw !== 'undefined') this.nsfw = Boolean(data.nsfw);
  }
}

module.exports = StoreChannel;
