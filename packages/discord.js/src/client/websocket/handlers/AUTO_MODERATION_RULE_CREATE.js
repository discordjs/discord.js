'use strict';

const Events = require('../../../util/Events');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (guild) return;

  const autoModerationRule = guild.autoModerationRules._add(data);

  /**
   * Emitted whenever an auto moderation rule is created.
   * <info>This event requires the {@link PermissionFlagsBits.ManageGuild} permission.</info>
   * @event Client#autoModerationRuleCreate
   * @param {AutoModerationRule} autoModerationRule The created auto moderation rule
   */
  client.emit(Events.AutoModerationRuleCreate, autoModerationRule);
};
