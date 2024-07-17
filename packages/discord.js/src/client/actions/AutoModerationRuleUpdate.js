'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

/**
 * @extends {Action<[import('discord-api-types/v10').GatewayAutoModerationRuleDeleteDispatchData]>}
 * @ignore
 */
class AutoModerationRuleUpdateAction extends Action {
  /**
   * @override
   * @param {import('discord-api-types/v10').GatewayAutoModerationRuleDeleteDispatchData} data
   */
  handle(data) {
    const { client } = this;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const oldAutoModerationRule = guild.autoModerationRules.cache.get(data.id)?._clone() ?? null;
      const newAutoModerationRule = guild.autoModerationRules._add(data);

      /**
       * Emitted whenever an auto moderation rule gets updated.
       * <info>This event requires the {@link PermissionFlagsBits.ManageGuild} permission.</info>
       * @event Client#autoModerationRuleUpdate
       * @param {?AutoModerationRule} oldAutoModerationRule The auto moderation rule before the update
       * @param {AutoModerationRule} newAutoModerationRule The auto moderation rule after the update
       */
      client.emit(Events.AutoModerationRuleUpdate, oldAutoModerationRule, newAutoModerationRule);
    }

    return {};
  }
}

module.exports = AutoModerationRuleUpdateAction;
