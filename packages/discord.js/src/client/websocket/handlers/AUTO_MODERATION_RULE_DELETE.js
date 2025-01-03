'use strict';

const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (guild) return;

  const autoModerationRule = guild.autoModerationRules.cache.get(data.id);
  if (!autoModerationRule) return;

  guild.autoModerationRules.cache.delete(autoModerationRule.id);

  /**
   * Emitted whenever an auto moderation rule is deleted.
   * <info>This event requires the {@link PermissionFlagsBits.ManageGuild} permission.</info>
   * @event Client#autoModerationRuleDelete
   * @param {AutoModerationRule} autoModerationRule The deleted auto moderation rule
   */
  client.emit(Events.AutoModerationRuleDelete, autoModerationRule);
};
