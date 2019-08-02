'use strict';

const Action = require('./Action');
const { Events, Status } = require('../../util/Constants');

class GuildMemberRemoveAction extends Action {
  handle(data, shard) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    let member = null;
    if (guild) {
      member = this.getMember(data, guild);
      guild.memberCount--;
      if (member) {
        member.deleted = true;
        guild.members.remove(member.id);
        /**
         * Emitted whenever a member leaves a guild, or is kicked.
         * @event Client#guildMemberRemove
         * @param {GuildMember} member The member that has left/been kicked from the guild
         */
        if (shard.status === Status.READY) client.emit(Events.GUILD_MEMBER_REMOVE, member);
      }
      guild.voiceStates.delete(data.user.id);
    }
    return { guild, member };
  }
}


module.exports = GuildMemberRemoveAction;
