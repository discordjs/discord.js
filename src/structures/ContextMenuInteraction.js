'use strict';

const BaseCommandInteraction = require('./BaseCommandInteraction');
const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');
const { ApplicationCommandOptionTypes, ApplicationCommandTypes } = require('../util/Constants');

/**
 * Represents a context menu interaction.
 * @extends {BaseCommandInteraction}
 */
class ContextMenuInteraction extends BaseCommandInteraction {
  constructor(client, data) {
    super(client, data);
    /**
     * The target of the interaction, parsed into options
     * @type {CommandInteractionOptionResolver}
     */
    this.options = new CommandInteractionOptionResolver(
      this.client,
      this.resolveContextMenuOptions(data.data),
      this.transformResolved(data.data.resolved),
    );

    /**
     * The id of the target of this interaction
     * @type {Snowflake}
     */
    this.targetId = data.data.target_id;

    /**
     * The type of the target of the interaction; either USER or MESSAGE
     * @type {ApplicationCommandType}
     */
    this.targetType = ApplicationCommandTypes[data.data.type];
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
        this.transformOption({ name: 'user', type: ApplicationCommandOptionTypes.USER, value: target_id }, resolved),
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

module.exports = ContextMenuInteraction;
