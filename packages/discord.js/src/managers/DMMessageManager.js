'use strict';

const MessageManager = require('./MessageManager');

/**
 * Manages API methods for Messages and holds their cache.
 * @extends {MessageManager}
 */
class DMMessageManager extends MessageManager {
  /**
   * The channel that the messages belong to
   * @name DMMessageManager#channel
   * @type {DMChannel}
   */
}

module.exports = DMMessageManager;
