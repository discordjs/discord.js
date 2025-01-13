'use strict';

const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;

  /**
   * Emitted whenever a guild integration is updated
   * @event Client#guildIntegrationsUpdate
   * @param {Guild} guild The guild whose integrations were updated
   */
  client.emit(Events.GuildIntegrationsUpdate, guild);
};
