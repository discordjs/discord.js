'use strict';

const MessageComponentInteraction = require('./MessageComponentInteraction');

/**
 * Represents a base select menu interaction.
 * @extends {MessageComponentInteraction}
 */
class SelectMenuInteraction extends MessageComponentInteraction {
  constructor(client, data) {
    super(client, data);
    /**
     * The values selected, if the component which was interacted with was a select menu
     * @type {string[]}
     */
    this.values = data.data.values ?? [];
  }
}

module.exports = SelectMenuInteraction;
