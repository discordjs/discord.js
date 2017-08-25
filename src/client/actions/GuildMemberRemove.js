const Action = require('./Action');
const Constants = require('../../util/Constants');

class GuildMemberRemoveAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    let member = null;
    if (guild) {
      member = guild.members.get(data.user.id);
      if (member) {
        guild.memberCount--;
        guild.members.remove(member.id);
        if (client.status === Constants.Status.READY) client.emit(Constants.Events.GUILD_MEMBER_REMOVE, member);
      }
    }
    return { guild, member };
  }
}

/**
 * Emitted whenever a member leaves a guild, or is kicked.
 * @event Client#guildMemberRemove
 * @param {GuildMember} member The member that has left/been kicked from the guild
 */

module.exports = GuildMemberRemoveAction;
