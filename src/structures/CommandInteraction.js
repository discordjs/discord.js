'use strict';

const BaseCommandInteraction = require('./BaseCommandInteraction');

/**
 * Represents a command interaction.
 * @extends {BaseCommandInteraction}
 */
class CommandInteraction extends BaseCommandInteraction {
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

module.exports = CommandInteraction;
