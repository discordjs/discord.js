'use strict';

const Action = require('./Action');
const AutoModerationActionExecution = require('../../structures/AutoModerationActionExecution');
const Events = require('../../util/Events');

class AutoModerationRuleActionExecution extends Action {
  handle(data) {
    const { client } = this;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      /**
       * Emitted whenever an auto moderation rule is triggered.
       * @event Client#autoModerationActionExecution
       * @param {AutoModerationActionExecution} autoModerationActionExecution The data of the execution
       */
      client.emit(Events.AutoModerationActionExecution, new AutoModerationActionExecution(data));
    }

    return {};
  }
}

module.exports = AutoModerationRuleActionExecution;
