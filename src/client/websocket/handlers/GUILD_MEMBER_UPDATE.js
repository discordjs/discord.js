'use strict';

const { Status, Events } = require('../../../util/Constants');

module.exports = (client, { d: data }, shard) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (guild) {
    const member = guild.members.cache.get(data.user.id);
    if (member) {
      const old = member._update(data);
      if (shard.status === Status.READY) {
        /**
         * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
         * @event Client#guildMemberUpdate
         * @param {GuildMember} oldMember The member before the update
         * @param {GuildMember} newMember The member after the update
         */
        client.emit(Events.GUILD_MEMBER_UPDATE, old, member);
      }
    }
  }
};
