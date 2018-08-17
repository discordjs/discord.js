const Action = require('./Action');
const { Events, Status } = require('../../util/Constants');

class GuildMemberRemoveAction extends Action {
  handle(data) {
    const client = this.client;
    this._patch(data);
    const guild = client.guilds.get(data.guild_id);
    let member = null;
    if (guild) {
      member = guild.members.get(data.user.id);
      guild.memberCount--;
      if (member) {
        guild.voiceStates.delete(member.id);
        member.deleted = true;
        guild.members.remove(member.id);
        if (client.status === Status.READY) client.emit(Events.GUILD_MEMBER_REMOVE, member);
      }
    }
    return { guild, member };
  }

  _patch(data) {
    data.guild_id = BigInt(data.guild_id);
    data.user.id = BigInt(data.user.id);
  }
}

/**
 * Emitted whenever a member leaves a guild, or is kicked.
 * @event Client#guildMemberRemove
 * @param {GuildMember} member The member that has left/been kicked from the guild
 */

module.exports = GuildMemberRemoveAction;
