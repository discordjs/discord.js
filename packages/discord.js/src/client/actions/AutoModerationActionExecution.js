'use strict';

const Action = require('./Action');
const AutoModActionExecution = require('../../structures/AutoModActionExecution');
const Events = require('../../util/Events');

class AutoModerationRuleActionExecution extends Action {
  handle(data) {
    const { client } = this;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      /**
       * Emitted whenever an AutoMod rule is triggered.
       * @event Client#autoModerationActionExecution
       * @param {AutoModActionExecution} autoModActionExecution The data of the execution
       */
      client.emit(Events.AutoModerationActionExecution, new AutoModActionExecution(data));
    }

    return {};
  }
}

module.exports = AutoModerationRuleActionExecution;
