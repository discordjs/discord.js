'use strict';

const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');
const Interaction = require('./Interaction');

/**
 * Represents a autocomplete interaction.
 * @extends {Interaction}
 */
class AutocompleteInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);

    /**
     * The options passed to the command.
     * @type {CommandInteractionOptionResolver}
     */
    this.options = new CommandInteractionOptionResolver(
      this.client,
      data.data.options?.map(option => this.transformOption(option, data.data.resolved)) ?? [],
      this.transformResolved(data.data.resolved ?? {}),
    );
  }
}

module.exports = AutocompleteInteraction;
