'use strict';

const { Events } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  let command;

  if (data.guild_id) {
    const guild = client.guilds.cache.get(data.guild_id);
    if (!guild) return;
    command = guild.commands._add(data);
  } else {
    command = client.application.commands._add(data);
  }

  /**
   * Emitted when an application command is created.
   * @event Client#applicationCommandCreate
   * @param {ApplicationCommand} command The command which was created
   */
  client.emit(Events.APPLICATION_COMMAND_CREATE, command);
};
