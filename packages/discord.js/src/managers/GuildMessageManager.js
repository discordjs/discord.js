'use strict';

const MessageManager = require('./MessageManager');

/**
 * Manages API methods for messages in a guild and holds their cache.
 * @extends {MessageManager}
 */
class GuildMessageManager extends MessageManager {
  /**
   * The channel that the messages belong to
   * @name GuildMessageManager#channel
   * @type {GuildTextBasedChannel}
   */
}

module.exports = GuildMessageManager;
