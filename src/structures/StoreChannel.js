'use strict';

const GuildChannel = require('./GuildChannel');

/**
 * Represents a guild store channel on Discord.
 * @extends {GuildChannel}
 */
class StoreChannel extends GuildChannel {
  /**
   * @param {Guild} guild The guild the store channel is part of
   * @param {APIChannel} data The data for the store channel
   * @param {Client} [client] A safety parameter for the client that instantiated this
   */
  constructor(guild, data, client) {
    super(guild, data, client);

    /**
     * If the guild considers this channel NSFW
     * @type {boolean}
     */
    this.nsfw = Boolean(data.nsfw);
  }

  _patch(data) {
    super._patch(data);

    if ('nsfw' in data) {
      this.nsfw = Boolean(data.nsfw);
    }
  }
}

module.exports = StoreChannel;
