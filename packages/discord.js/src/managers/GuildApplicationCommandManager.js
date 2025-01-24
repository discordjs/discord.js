'use strict';

const { ApplicationCommandManager } = require('./ApplicationCommandManager.js');
const { ApplicationCommandPermissionsManager } = require('./ApplicationCommandPermissionsManager.js');

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

    /**
     * The manager for permissions of arbitrary commands on this guild
     * @type {ApplicationCommandPermissionsManager}
     */
    this.permissions = new ApplicationCommandPermissionsManager(this);
  }
}

exports.GuildApplicationCommandManager = GuildApplicationCommandManager;
