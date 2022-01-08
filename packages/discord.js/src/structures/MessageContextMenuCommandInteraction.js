'use strict';

const ContextMenuCommandInteraction = require('./ContextMenuCommandInteraction');

/**
 * Represents a message context menu interaction.
 * @extends {ContextMenuCommandInteraction}
 */
class MessageContextMenuCommandInteraction extends ContextMenuCommandInteraction {
  /**
   * The message this interaction was sent from
   * @type {Message|APIMessage}
   * @readonly
   */
  get targetMessage() {
    return this.options.getMessage('message');
  }
}

module.exports = MessageContextMenuCommandInteraction;
