const Action = require('./Action');
const Constants = require('../../util/Constants');

class GuildMemberRemoveAction extends Action {

  constructor(client) {
    super(client);
    this.deleted = {};
  }

  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      let member = guild.members.get(data.user.id);
      if (member) {
        guild.memberCount--;
        guild._removeMember(member);
        this.deleted[guild.id + data.user.id] = member;
        if (client.status === Constants.Status.READY) client.emit(Constants.Events.GUILD_MEMBER_REMOVE, guild, member);
        this.scheduleForDeletion(guild.id, data.user.id);
      } else {
        member = this.deleted[guild.id + data.user.id];
      }

      return {
        guild,
        member,
      };
    }

    return {
      guild,
      member: null,
    };
  }

  scheduleForDeletion(guildID, userID) {
    this.client.setTimeout(() => delete this.deleted[guildID + userID], this.client.options.rest_ws_bridge_timeout);
  }
}

/**
 * Emitted whenever a member leaves a guild, or is kicked.
 *
 * @event Client#guildMemberRemove
 * @param {Guild} guild the guild that the member has left.
 * @param {GuildMember} member the member that has left the guild.
 */

module.exports = GuildMemberRemoveAction;
