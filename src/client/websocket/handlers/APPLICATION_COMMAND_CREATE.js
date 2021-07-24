'use strict';

const { Events } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  const commandManager = data.guild_id ? client.guilds.cache.get(data.guild_id)?.commands : client.application.commands;
  if (!commandManager) return;

  const command = commandManager._add(data, data.application_id === client.application.id);

  /**
   * Emitted when a guild application command is created.
   * @event Client#applicationCommandCreate
   * @param {ApplicationCommand} command The command which was created
   */
  client.emit(Events.APPLICATION_COMMAND_CREATE, command);
};
