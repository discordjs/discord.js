'use strict';

const ApplicationCommandManager = require('./ApplicationCommandManager');

/**
 * An extension for guild-specific application commands.
 * @extends {ApplicationCommandManager}
 */
class GuildApplicationCommandManager extends ApplicationCommandManager {
  constructor(guild, iterable) {
    super(guild.client, iterable);

    /**
     * The guild that this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }
}

module.exports = GuildApplicationCommandManager;
