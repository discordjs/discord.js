'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');
const Status = require('../../util/Status');

class GuildMemberUpdateAction extends Action {
  handle(data, shard) {
    const { client } = this;

    const guild = client.guilds.cache.get(data.guild_id);
    if (guild) {
      const member = this.getMember({ user: data.user }, guild);
      if (member) {
        const old = member._update(data);
        /**
         * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
         * @event Client#guildMemberUpdate
         * @param {GuildMember} oldMember The member before the update
         * @param {GuildMember} newMember The member after the update
         */
        if (shard.status === Status.Ready && !member.equals(old)) client.emit(Events.GuildMemberUpdate, old, member);
      } else {
        const newMember = guild.members._add(data);
        /**
         * Emitted whenever a member becomes available in a large guild.
         * @event Client#guildMemberAvailable
         * @param {GuildMember} member The member that became available
         */
        client.emit(Events.GuildMemberAvailable, newMember);
      }
    }
  }
}

module.exports = GuildMemberUpdateAction;
