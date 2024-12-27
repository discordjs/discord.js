'use strict';

const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.id);
  if (!guild) return;

  if (data.unavailable) {
    guild.available = false;

    /**
     * Emitted whenever a guild becomes unavailable, likely due to a server outage.
     * @event Client#guildUnavailable
     * @param {Guild} guild The guild that has become unavailable
     */
    client.emit(Events.GuildUnavailable, guild);

    // Stops the GuildDelete packet thinking a guild was actually deleted,
    // handles emitting of event itself
    return;
  }

  for (const channel of guild.channels.cache.values()) client.channels._remove(channel.id);
  client.voice.adapters.get(data.id)?.destroy();

  client.guilds.cache.delete(guild.id);

  /**
   * Emitted whenever a guild kicks the client or the guild is deleted/left.
   * @event Client#guildDelete
   * @param {Guild} guild The guild that was deleted
   */
  client.emit(Events.GuildDelete, guild);
};
