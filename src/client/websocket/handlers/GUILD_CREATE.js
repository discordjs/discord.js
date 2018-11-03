const { Events, Status } = require('../../../util/Constants');

module.exports = async (client, { d: data }, shard) => {
  let guild = client.guilds.get(data.id);
  if (guild) {
    if (!guild.available && !data.unavailable) {
      // A newly available guild
      guild._patch(data);
      client.ws.checkReady();
    }
  } else {
    // A new guild
    data.shardID = shard.id;
    guild = client.guilds.add(data);
    const emitEvent = client.ws.status === Status.READY;
    if (emitEvent) {
      /**
       * Emitted whenever the client joins a guild.
       * @event Client#guildCreate
       * @param {Guild} guild The created guild
       */
      if (client.options.fetchAllMembers) await guild.members.fetch();
      client.emit(Events.GUILD_CREATE, guild);
    }
  }
};
