'use strict';

const { Status } = require('../../../util/Constants');
const Events = require('../../../util/Events');

module.exports = (client, { d: data }, shard) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (guild) {
    guild.memberCount++;
    const member = guild.members._add(data);
    if (shard.status === Status.READY) {
      /**
       * Emitted whenever a user joins a guild.
       * @event Client#guildMemberAdd
       * @param {GuildMember} member The member that has joined a guild
       */
      client.emit(Events.GuildMemberAdd, member);
    }
  }
};
