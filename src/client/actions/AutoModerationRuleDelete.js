'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class AutoModerationRuleDeleteAction extends Action {
  handle(data) {
    const { client } = this;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const autoModerationRule = guild.autoModerationRules.cache.get(data.id);

      if (autoModerationRule) {
        guild.autoModerationRules.cache.delete(autoModerationRule.id);

        /**
         * Emitted whenever an auto moderation rule is deleted.
         * <info>This event requires the {@link Permissions.FLAGS.MANAGE_GUILD} permission.</info>
         * @event Client#autoModerationRuleDelete
         * @param {AutoModerationRule} autoModerationRule The deleted auto moderation rule
         */
        client.emit(Events.AUTO_MODERATION_RULE_DELETE, autoModerationRule);
      }
    }

    return {};
  }
}

module.exports = AutoModerationRuleDeleteAction;
