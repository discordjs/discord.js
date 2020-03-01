'use strict';

const { Events, Status } = require('../../../util/Constants');

module.exports = async (client, { d: data }, shard) => {
  let guild = client.guilds.cache.get(data.id);
  if (guild) {
    if (!guild.available && !data.unavailable) {
      // A newly available guild
      guild._patch(data);
      // If the client was ready before and we had unavailable guilds, fetch them
      if (client.ws.status === Status.READY && client.options.fetchAllMembers) {
        await guild.members
          .fetch()
          .catch(err => client.emit(Events.DEBUG, `Failed to fetch all members: ${err}\n${err.stack}`));
      }
    }
  } else {
    // A new guild
    data.shardID = shard.id;
    guild = client.guilds.add(data);
    if (client.ws.status === Status.READY) {
      /**
       * Emitted whenever the client joins a guild.
       * @event Client#guildCreate
       * @param {Guild} guild The created guild
       */
      if (client.options.fetchAllMembers) {
        await guild.members
          .fetch()
          .catch(err => client.emit(Events.DEBUG, `Failed to fetch all members: ${err}\n${err.stack}`));
      }
      client.emit(Events.GUILD_CREATE, guild);
    }
  }
};
