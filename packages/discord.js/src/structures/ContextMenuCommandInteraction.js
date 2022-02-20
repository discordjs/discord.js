'use strict';

const { ApplicationCommandOptionType } = require('discord-api-types/v9');
const CommandInteraction = require('./CommandInteraction');
const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');

/**
 * Represents a context menu interaction.
 * @extends {CommandInteraction}
 */
class ContextMenuCommandInteraction extends CommandInteraction {
  constructor(client, data = {}) {
    super(client, data);
  }
  /**
   * The id of the target of the interaction
   * @type {Snowflake}
   * @readonly
   */
  get targetId() {
    return this.data.target_id;
  }

  /**
   * The target of the interaction, parsed into options
   * @type {CommandInteractionOptionResolver}
   * @readonly
   */
  get options() {
    return new CommandInteractionOptionResolver(
      this.client,
      this.resolveContextMenuOptions(this.data),
      this.transformResolved(this.data.resolved),
    );
  }

  /**
   * Resolves and transforms options received from the API for a context menu interaction.
   * @param {APIApplicationCommandInteractionData} data The interaction data
   * @returns {CommandInteractionOption[]}
   * @private
   */
  resolveContextMenuOptions({ target_id, resolved }) {
    const result = [];

    if (resolved.users?.[target_id]) {
      result.push(
        this.transformOption({ name: 'user', type: ApplicationCommandOptionType.User, value: target_id }, resolved),
      );
    }

    if (resolved.messages?.[target_id]) {
      result.push({
        name: 'message',
        type: '_MESSAGE',
        value: target_id,
        message: this.channel?.messages._add(resolved.messages[target_id]) ?? resolved.messages[target_id],
      });
    }

    return result;
  }
}

module.exports = ContextMenuCommandInteraction;
