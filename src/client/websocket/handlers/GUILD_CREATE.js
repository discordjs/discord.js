'use strict';

const { Events, Status } = require('../../../util/Constants');

module.exports = (client, { d: data }, shard) => {
  let guild = client.guilds.cache.get(data.id);
  if (guild) {
    if (!guild.available && !data.unavailable) {
      // A newly available guild
      guild._patch(data);
    }
  } else {
    // A new guild
    data.shardId = shard.id;
    guild = client.guilds._add(data);
    if (client.ws.status === Status.READY) {
      /**
       * Emitted whenever the client joins a guild.
       * @event Client#guildCreate
       * @param {Guild} guild The created guild
       */
      client.emit(Events.GUILD_CREATE, guild);
    }
  }
};
