'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class AutoModerationRuleCreateAction extends Action {
  handle(data) {
    const { client } = this;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const autoModerationRule = guild.autoModerationRules._add(data);

      /**
       * Emitted whenever an auto moderation rule is created.
       * <info>This event requires the {@link PermissionFlagsBits.ManageGuild} permission.</info>
       * @event Client#autoModerationRuleCreate
       * @param {AutoModerationRule} autoModerationRule The created auto moderation rule
       */
      client.emit(Events.AutoModerationRuleCreate, autoModerationRule);
    }

    return {};
  }
}

module.exports = AutoModerationRuleCreateAction;
