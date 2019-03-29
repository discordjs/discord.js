'use strict';

const GuildChannel = require('./GuildChannel');

/**
 * Represents a guild store channel on Discord.
 * @extends {GuildChannel}
 */
class StoreChannel extends GuildChannel {
  _patch(data) {
    super._patch(data);

    /**
     * If the guild considers this channel NSFW
     * @type {boolean}
     * @readonly
     */
    this.nsfw = data.nsfw || /^nsfw(-|$)/.test(this.name);
  }

  fetchStoreListing() {
    return Promise.reject(new Error('Are we implementing this?'));
  }
}

module.exports = StoreChannel;
