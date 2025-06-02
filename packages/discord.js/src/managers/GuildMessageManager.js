'use strict';

const { Routes } = require('discord-api-types/v10');
const { DiscordjsTypeError, ErrorCodes } = require('../errors/index.js');
const { MessageManager } = require('./MessageManager.js');

/**
 * Manages API methods for messages in a guild and holds their cache.
 *
 * @extends {MessageManager}
 */
class GuildMessageManager extends MessageManager {
  /**
   * The channel that the messages belong to
   *
   * @name GuildMessageManager#channel
   * @type {GuildTextBasedChannel}
   */

  /**
   * Publishes a message in an announcement channel to all channels following it, even if it's not cached.
   *
   * @param {MessageResolvable} message The message to publish
   * @returns {Promise<Message>}
   */
  async crosspost(message) {
    const messageId = this.resolveId(message);
    if (!messageId) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'message', 'MessageResolvable');

    const data = await this.client.rest.post(Routes.channelMessageCrosspost(this.channel.id, messageId));
    return this.cache.get(data.id) ?? this._add(data);
  }
}

exports.GuildMessageManager = GuildMessageManager;
