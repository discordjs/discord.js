'use strict';

const { chatInputMention } = require('@discordjs/builders');
const CommandInteraction = require('./CommandInteraction');
const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');

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
      this.transformResolved(data.data.resolved ?? {}),
    );
  }

  /**
   * When concatenated with a string, this automatically returns the command's instead of the ChatInputCommandInteraction object.
   * @returns {string}
   * @example
   * // Logs: Hello from </123456789012345678>!
   * console.log(`Hello from ${interaction}!`);
   */
  toString() {
    return chatInputMention(this.id, this.commandName);
  }
}

module.exports = ChatInputCommandInteraction;
