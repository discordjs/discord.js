'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class AutoModerationRuleUpdateAction extends Action {
  handle(data) {
    const { client } = this;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const oldAutoModerationRule = guild.autoModerationRules.cache.get(data.id)?._clone() ?? null;
      const newAutoModerationRule = guild.autoModerationRules._add(data);

      /**
       * Emitted whenever an auto moderation rule gets updated.
       * <info>This event requires the {@link Permissions.FLAGS.MANAGE_GUILD} permission.</info>
       * @event Client#autoModerationRuleUpdate
       * @param {?AutoModerationRule} oldAutoModerationRule The auto moderation rule before the update
       * @param {AutoModerationRule} newAutoModerationRule The auto moderation rule after the update
       */
      client.emit(Events.AUTO_MODERATION_RULE_UPDATE, oldAutoModerationRule, newAutoModerationRule);
    }

    return {};
  }
}

module.exports = AutoModerationRuleUpdateAction;
