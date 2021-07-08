'use strict';

const Action = require('./Action');
const { Status, Events } = require('../../util/Constants');

class GuildMemberUpdateAction extends Action {
  handle(data, shard) {
    const { client } = this;
    if (data.user.username) {
      const user = client.users.cache.get(data.user.id);
      if (!user) {
        client.users._add(data.user);
      } else if (!user.equals(data.user)) {
        client.actions.UserUpdate.handle(data.user);
      }
    }

    const guild = client.guilds.cache.get(data.guild_id);
    if (guild) {
      const member = this.getMember({ user: data.user }, guild);
      if (member) {
        const old = member._update(data);
        /**
         * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
         * Also emitted when the user's details (e.g. username) change.
         * @event Client#guildMemberUpdate
         * @param {GuildMember} oldMember The member before the update
         * @param {GuildMember} newMember The member after the update
         */
        if (shard.status === Status.READY && !member.equals(old)) client.emit(Events.GUILD_MEMBER_UPDATE, old, member);
      } else {
        const newMember = guild.members._add(data);
        /**
         * Emitted whenever a member becomes available in a large guild.
         * @event Client#guildMemberAvailable
         * @param {GuildMember} member The member that became available
         */
        this.client.emit(Events.GUILD_MEMBER_AVAILABLE, newMember);
      }
    }
  }
}

module.exports = GuildMemberUpdateAction;
