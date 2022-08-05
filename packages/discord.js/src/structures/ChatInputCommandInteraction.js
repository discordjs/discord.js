'use strict';

const ChatInputCommandInteractionOptionResolver = require('./ChatInputCommandInteractionOptionResolver');
const CommandInteraction = require('./CommandInteraction');

/**
 * Represents a command interaction.
 * @extends {CommandInteraction}
 */
class ChatInputCommandInteraction extends CommandInteraction {
  constructor(client, data) {
    super(client, data);

    /**
     * The options passed to the command.
     * @type {CommandInteractionOptionResolver}
     */
    this.options = new ChatInputCommandInteractionOptionResolver(
      this.client,
      data.data.options?.map(option => this.transformOption(option, data.data.resolved)) ?? [],
      this.transformResolved(data.data.resolved ?? {}),
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
