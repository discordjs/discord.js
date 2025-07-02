'use strict';

const { Events } = require('../../../util/Events.js');
const { Status } = require('../../../util/Status.js');

module.exports = (client, { d: data }, shardId) => {
  let guild = client.guilds.cache.get(data.id);
  if (guild) {
    if (!guild.available && !data.unavailable) {
      // A newly available guild
      guild._patch(data);

      /**
       * Emitted whenever a guild becomes available.
       *
       * @event Client#guildAvailable
       * @param {Guild} guild The guild that became available
       */
      client.emit(Events.GuildAvailable, guild);
    }
  } else {
    // A new guild
    data.shardId = shardId;
    guild = client.guilds._add(data);
    if (client.status === Status.Ready) {
      /**
       * Emitted whenever the client joins a guild.
       *
       * @event Client#guildCreate
       * @param {Guild} guild The created guild
       */
      client.emit(Events.GuildCreate, guild);
    }
  }
};
