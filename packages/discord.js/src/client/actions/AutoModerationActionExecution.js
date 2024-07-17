'use strict';

const Action = require('./Action');
const AutoModerationActionExecution = require('../../structures/AutoModerationActionExecution');
const Events = require('../../util/Events');

/**
 * @extends {Action<[import('discord-api-types/v10').GatewayAutoModerationActionExecutionDispatchData]>}
 * @ignore
 */
class AutoModerationActionExecutionAction extends Action {
  /**
   * @override
   * @param {import('discord-api-types/v10').GatewayAutoModerationActionExecutionDispatchData} data
   */
  handle(data) {
    const { client } = this;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      /**
       * Emitted whenever an auto moderation rule is triggered.
       * <info>This event requires the {@link PermissionFlagsBits.ManageGuild} permission.</info>
       * @event Client#autoModerationActionExecution
       * @param {AutoModerationActionExecution} autoModerationActionExecution The data of the execution
       */
      client.emit(Events.AutoModerationActionExecution, new AutoModerationActionExecution(data, guild));
    }

    return {};
  }
}

module.exports = AutoModerationActionExecutionAction;
