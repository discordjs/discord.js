'use strict';

const { Routes } = require('discord-api-types/v10');
const MessageManager = require('./MessageManager');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');

/**
 * Manages API methods for Messages and holds their cache.
 * @extends {MessageManager}
 */
class GuildMessageManager extends MessageManager {
  /**
   * The channel that the messages belong to
   * @name GuildMessageManager#channel
   * @type {GuildTextBasedChannel}
   */

  /**
   * Publishes a message in an announcement channel to all channels following it, even if it's not cached.
   * @param {MessageResolvable} message The message to publish
   * @returns {Promise<Message>}
   */
  async crosspost(message) {
    message = this.resolveId(message);
    if (!message) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'message', 'MessageResolvable');

    const data = await this.client.rest.post(Routes.channelMessageCrosspost(this.channel.id, message));
    return this.cache.get(data.id) ?? this._add(data);
  }
}

module.exports = GuildMessageManager;
