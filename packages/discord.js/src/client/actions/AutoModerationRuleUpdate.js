'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class AutoModerationRuleUpdateAction extends Action {
  handle(data) {
    const { client } = this;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const oldAutoModRule = guild.autoModRules.cache.get(data.id)?._clone() ?? null;
      const newAutoModRule = guild.autoModRules._add(data);

      /**
       * Emitted whenever an AutoMod rule gets updated.
       * @event Client#autoModerationRuleUpdate
       * @param {?AutoModRule} oldAutoModRule The AutoMod rule object before the update
       * @param {AutoModRule} newAutoModRule The AutoMod rule object after the update
       */
      client.emit(Events.AutoModerationRuleUpdate, oldAutoModRule, newAutoModRule);
    }

    return {};
  }
}

module.exports = AutoModerationRuleUpdateAction;
