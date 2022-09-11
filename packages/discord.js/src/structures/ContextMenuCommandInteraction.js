'use strict';

const { ApplicationCommandOptionType } = require('discord-api-types/v10');
const CommandInteraction = require('./CommandInteraction');
const ContextMenuCommandInteractionOptionResolver = require('./ContextMenuCommandInteractionOptionResolver');
const { lazy } = require('../util/Util');

const getMessage = lazy(() => require('./Message').Message);

/**
 * Represents a context menu interaction.
 * @extends {CommandInteraction}
 */
class ContextMenuCommandInteraction extends CommandInteraction {
  constructor(client, data) {
    super(client, data);
    /**
     * The target of the interaction, parsed into options
     * @type {CommandInteractionOptionResolver}
     */
    this.options = new ContextMenuCommandInteractionOptionResolver(
      this.client,
      this.resolveContextMenuOptions(data.data),
      this.transformResolved(data.data.resolved),
    );

    /**
     * The id of the target of the interaction
     * @type {Snowflake}
     */
    this.targetId = data.data.target_id;
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
        message:
          this.channel?.messages._add(resolved.messages[target_id]) ??
          new (getMessage())(this.client, resolved.messages[target_id]),
      });
    }

    return result;
  }
}

module.exports = ContextMenuCommandInteraction;
