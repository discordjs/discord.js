'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class AutoModerationRuleUpdateAction extends Action {
  handle(data) {
    const { client } = this;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const oldAutoModerationRule = guild.autoModerationRules.cache.get(data.id)?._clone() ?? null;
      const newAutoModerationRule = guild.autoModerationRules._add(data);

      /**
       * Emitted whenever an auto moderation rule gets updated.
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
