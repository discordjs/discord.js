'use strict';

const ContextMenuInteraction = require('./ContextMenuInteraction');

/**
 * Represents a user context menu interaction.
 * @extends {ContextMenuInteraction}
 */
class MessageContextMenuInteraction extends ContextMenuInteraction {
  /**
   * The message this interaction was sent from
   * @type {Message|APIMessage}
   * @readonly
   */
  get message() {
    return this.options.getMessage('message');
  }
}

module.exports = MessageContextMenuInteraction;
