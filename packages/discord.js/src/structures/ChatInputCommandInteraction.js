'use strict';

const CommandInteraction = require('./CommandInteraction');
const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');

/**
 * Represents a command interaction.
 * @extends {CommandInteraction}
 */
class ChatInputCommandInteraction extends CommandInteraction {
  constructor(client, data = {}) {
    super(client, data);
  }
  /**
   * The options passed to the command.
   * @type {CommandInteractionOptionResolver}
   * @readonly
   */
  get options() {
    return new CommandInteractionOptionResolver(
      this.client,
      this.data.options?.map(option => this.transformOption(option, this.data.resolved)) ?? [],
      this.transformResolved(this.data.resolved ?? {}),
    );
  }

  /**
   * Returns a string representation of the command interaction.
   * This can then be copied by a user and executed again in a new command while keeping the option order.
   * @returns {string}
   */
  toString() {
    const properties = [
      this.commandName,
      this.options._group,
      this.options._subcommand,
      ...this.options._hoistedOptions.map(o => `${o.name}:${o.value}`),
    ];
    return `/${properties.filter(Boolean).join(' ')}`;
  }
}

module.exports = ChatInputCommandInteraction;
