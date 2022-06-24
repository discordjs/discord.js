'use strict';

const { BaseChannel } = require('./BaseChannel');

/**
 * Represents a channel that displays a directory of guilds.
 * @extends {BaseChannel}
 */
class DirectoryChannel extends BaseChannel {
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
