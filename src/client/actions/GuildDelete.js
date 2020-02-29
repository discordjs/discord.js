'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;

    let guild = client.guilds.cache.get(data.id);
    if (guild) {
      for (const channel of guild.channels.cache.values()) {
        if (channel.type === 'text') channel.stopTyping(true);
      }

      if (guild.available && data.unavailable) {
        // Guild is unavailable
        guild.available = false;

        /**
         * Emitted whenever a guild becomes unavailable, likely due to a server outage.
         * @event Client#guildUnavailable
         * @param {Guild} guild The guild that has become unavailable
         */
        client.emit(Events.GUILD_UNAVAILABLE, guild);

        // Stops the GuildDelete packet thinking a guild was actually deleted,
        // handles emitting of event itself
        return {
          guild: null,
        };
      }

      for (const channel of guild.channels.cache.values()) this.client.channels.remove(channel.id);
      if (guild.voice && guild.voice.connection) guild.voice.connection.disconnect();

      // Delete guild
      client.guilds.cache.delete(guild.id);
      guild.deleted = true;

      /**
       * Emitted whenever a guild kicks the client or the guild is deleted/left.
       * @event Client#guildDelete
       * @param {Guild} guild The guild that was deleted
       */
      client.emit(Events.GUILD_DELETE, guild);

      this.deleted.set(guild.id, guild);
      this.scheduleForDeletion(guild.id);
    } else {
      guild = this.deleted.get(data.id) || null;
    }

    return { guild };
  }

  scheduleForDeletion(id) {
    this.client.setTimeout(() => this.deleted.delete(id), this.client.options.restWsBridgeTimeout);
  }
}

module.exports = GuildDeleteAction;
