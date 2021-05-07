'use strict';

const ApplicationCommand = require('../../../structures/ApplicationCommand');
const { Events } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  let command;

  if (data.guild_id) {
    const guild = client.guilds.cache.get(data.guild_id);
    if (!guild) return;
    command = guild.commands.cache.get(data.id) ?? new ApplicationCommand(client, data, guild);
    guild.commands.cache.delete(data.id);
  } else {
    command = client.application.commands.cache.get(data) ?? new ApplicationCommand(client, data);
    client.application.commands.cache.delete(data.id);
  }

  /**
   * Emitted when an application command is deleted.
   * @event Client#applicationCommandDelete
   * @param {ApplicationCommand} command The command which was deleted
   */
  client.emit(Events.APPLICATION_COMMAND_DELETE, command);
};
