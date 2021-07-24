'use strict';

const { Events } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  const commandManager = data.guild_id ? client.guilds.cache.get(data.guild_id)?.commands : client.application.commands;
  if (!commandManager) return;

  const oldCommand = commandManager.cache.get(data.id)?._clone() ?? null;
  const newCommand = commandManager._add(data, data.application_id === client.application.id);

  /**
   * Emitted when a guild application command is updated.
   * @event Client#applicationCommandUpdate
   * @param {?ApplicationCommand} oldCommand The command before the update
   * @param {ApplicationCommand} newCommand The command after the update
   */
  client.emit(Events.APPLICATION_COMMAND_UPDATE, oldCommand, newCommand);
};
