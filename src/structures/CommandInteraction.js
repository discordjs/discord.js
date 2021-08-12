'use strict';

const BaseCommandInteraction = require('./BaseCommandInteraction');
const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');

/**
 * Represents a command interaction.
 * @extends {BaseCommandInteraction}
 */
class CommandInteraction extends BaseCommandInteraction {
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
