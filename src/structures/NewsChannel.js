'use strict';

const TextChannel = require('./TextChannel');

/**
 * Represents a guild news channel on Discord.
 * @extends {TextChannel}
 */
class NewsChannel extends TextChannel {
  _patch(data) {
    super._patch(data);

    // News channels don't have a rate limit per user, remove it
    this.rateLimitPerUser = undefined;
  }

  /**
   * Crossposts a Message in this channel.
   * @param {Message} message The message to crosspost.
   * @returns {Promise<Message>}
   */
  crosspost(message) {
    return this.client.api
      .channels(this.id)
      .messages(message.id)
      .crosspost()
      .post();
  }
}

module.exports = NewsChannel;
