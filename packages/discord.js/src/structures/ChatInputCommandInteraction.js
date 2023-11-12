'use strict';

const CommandInteraction = require('./CommandInteraction');
const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');
const { transformResolved } = require('../util/Util');

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
    this.options = new CommandInteractionOptionResolver(
      this.client,
      data.data.options?.map(option => this.transformOption(option, data.data.resolved)) ?? [],
      transformResolved({ client: this.client, guild: this.guild, channel: this.channel }, data.data.resolved),
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
      ...this.options._hoistedOptions.map(option => `${option.name}:${option.value}`),
    ];
    return `/${properties.filter(Boolean).join(' ')}`;
  }
}

module.exports = ChatInputCommandInteraction;
