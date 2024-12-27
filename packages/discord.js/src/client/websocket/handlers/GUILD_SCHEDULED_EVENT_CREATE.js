'use strict';

const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;

  const guildScheduledEvent = guild.scheduledEvents._add(data);

  /**
   * Emitted whenever a guild scheduled event is created.
   * @event Client#guildScheduledEventCreate
   * @param {GuildScheduledEvent} guildScheduledEvent The created guild scheduled event
   */
  client.emit(Events.GuildScheduledEventCreate, guildScheduledEvent);
};
