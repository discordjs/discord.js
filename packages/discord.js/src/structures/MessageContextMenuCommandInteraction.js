import { ContextMenuCommandInteraction } from './ContextMenuCommandInteraction.js';

/**
 * Represents a message context menu interaction.
 *
 * @extends {ContextMenuCommandInteraction}
 */
export class MessageContextMenuCommandInteraction extends ContextMenuCommandInteraction {
  /**
   * The message this interaction was sent from
   *
   * @type {Message|APIMessage}
   * @readonly
   */
  get targetMessage() {
    return this.options.getMessage('message');
  }
}
