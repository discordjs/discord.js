'use strict';

const { Events } = require('../../../util/Constants');

let deprecationEmitted = false;

module.exports = (client, { d: data }) => {
  const commandManager = data.guild_id ? client.guilds.cache.get(data.guild_id)?.commands : client.application.commands;
  if (!commandManager) return;

  const command = commandManager._add(data, data.application_id === client.application.id);

  /**
   * Emitted when a guild application command is created.
   * @event Client#applicationCommandCreate
   * @param {ApplicationCommand} command The command which was created
   * @deprecated See [this issue](https://github.com/discord/discord-api-docs/issues/3690) for more information.
   */

  if (client.emit(Events.APPLICATION_COMMAND_CREATE, command) && !deprecationEmitted) {
    deprecationEmitted = true;

    process.emitWarning(
      /* eslint-disable-next-line max-len */
      'The applicationCommandCreate event is deprecated. See https://github.com/discord/discord-api-docs/issues/3690 for more information.',
      'DeprecationWarning',
    );
  }
};
