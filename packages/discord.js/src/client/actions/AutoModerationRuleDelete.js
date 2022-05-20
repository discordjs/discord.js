'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class AutoModerationRuleDeleteAction extends Action {
  handle(data) {
    const { client } = this;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const autoModRule = guild.autoModRules.cache.get(data.id);

      if (autoModRule) {
        guild.autoModRules.cache.delete(autoModRule.id);

        /**
         * Emitted whenever an AutoMod rule is deleted.
         * @event Client#autoModerationRuleDelete
         * @param {AutoModRule} autoModRule The deleted AutoMod rule
         */
        client.emit(Events.AutoModerationRuleUpdate, autoModRule);
      }
    }

    return {};
  }
}

module.exports = AutoModerationRuleDeleteAction;
