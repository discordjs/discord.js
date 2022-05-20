'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class AutoModerationRuleCreateAction extends Action {
  handle(data) {
    const { client } = this;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const autoModRule = guild.autoModRules._add(data);

      /**
       * Emitted whenever an AutoMod rule is created.
       * @event Client#autoModerationRuleCreate
       * @param {AutoModRule} autoModRule The created AutoMod rule
       */
      client.emit(Events.AutoModerationRuleCreate, autoModRule);
    }

    return {};
  }
}

module.exports = AutoModerationRuleCreateAction;
