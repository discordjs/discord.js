'use strict';

const BaseGuildTextChannel = require('./BaseGuildTextChannel');

/**
 * Represents a guild text channel on Discord.
 * @extends {BaseGuildTextChannel}
 */
class TextChannel extends BaseGuildTextChannel {
  _patch(data) {
    super._patch(data);

    if ('rate_limit_per_user' in data) {
      /**
       * The ratelimit per user for this channel in seconds
       * @type {number}
       */
      this.rateLimitPerUser = data.rate_limit_per_user;
    }
  }

  /**
   * Sets the rate limit per user for this channel.
   * @param {number} rateLimitPerUser The new ratelimit in seconds
   * @param {string} [reason] Reason for changing the channel's ratelimits
   * @returns {Promise<TextChannel>}
   */
  setRateLimitPerUser(rateLimitPerUser, reason) {
    return this.edit({ rateLimitPerUser }, reason);
  }
}

module.exports = TextChannel;
