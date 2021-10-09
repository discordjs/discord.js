'use strict';

const ApplicationCommandInteraction = require('./ApplicationCommandInteraction');
const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');

/**
 * Represents a command interaction.
 * @extends {ApplicationCommandInteraction}
 */
class CommandInteraction extends ApplicationCommandInteraction {
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

module.exports = CommandInteraction;
