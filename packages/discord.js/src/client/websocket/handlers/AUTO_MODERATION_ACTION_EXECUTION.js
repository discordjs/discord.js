'use strict';

const AutoModerationActionExecution = require('../../../structures/AutoModerationActionExecution.js');
const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (guild) return;

  /**
   * Emitted whenever an auto moderation rule is triggered.
   * <info>This event requires the {@link PermissionFlagsBits.ManageGuild} permission.</info>
   * @event Client#autoModerationActionExecution
   * @param {AutoModerationActionExecution} autoModerationActionExecution The data of the execution
   */
  client.emit(Events.AutoModerationActionExecution, new AutoModerationActionExecution(data, guild));
};
