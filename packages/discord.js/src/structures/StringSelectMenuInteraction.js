import { MessageComponentInteraction } from './MessageComponentInteraction.js';

/**
 * Represents a {@link ComponentType.StringSelect} select menu interaction.
 *
 * @extends {MessageComponentInteraction}
 */
export class StringSelectMenuInteraction extends MessageComponentInteraction {
  constructor(client, data) {
    super(client, data);

    /**
     * The values selected
     *
     * @type {string[]}
     */
    this.values = data.data.values ?? [];
  }
}
