'use strict';

const { Channel } = require('./Channel');

/**
 * Represents a channel that displays a directory of guilds.
 * @extends {Channel}
 */
class DirectoryChannel extends Channel {
  constructor(guild, data, client) {
    super(client, data);

    /**
     * The guild the channel is in
     * @type {InviteGuild}
     */
    this.guild = guild;

    /**
     * The id of the guild the channel is in
     * @type {Snowflake}
     */
    this.guildId = guild.id;
  }

  _patch(data) {
    super._patch(data);
    /**
     * The channel's name
     * @type {string}
     */
    this.name = data.name;
  }
}

module.exports = DirectoryChannel;
