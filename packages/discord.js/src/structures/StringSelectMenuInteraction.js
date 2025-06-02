'use strict';

const { MessageComponentInteraction } = require('./MessageComponentInteraction.js');

/**
 * Represents a {@link ComponentType.StringSelect} select menu interaction.
 *
 * @extends {MessageComponentInteraction}
 */
class StringSelectMenuInteraction extends MessageComponentInteraction {
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

exports.StringSelectMenuInteraction = StringSelectMenuInteraction;
