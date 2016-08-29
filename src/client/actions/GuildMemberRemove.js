const Action = require('./Action');
const Constants = require('../../util/Constants');

class GuildMemberRemoveAction extends Action {

  constructor(client) {
    super(client);
    this.timeouts = [];
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
        client.emit(Constants.Events.GUILD_MEMBER_REMOVE, guild, member);
        this.scheduleForDeletion(guild.id, data.user.id);
      }

      if (!member) {
        member = this.deleted[guild.id + data.user.id];
      }

      return {
        g: guild,
        m: member,
      };
    }

    return {
      g: guild,
      m: null,
    };
  }

  scheduleForDeletion(guildID, userID) {
    this.timeouts.push(
      setTimeout(() => delete this.deleted[guildID + userID],
        this.client.options.rest_ws_bridge_timeout)
    );
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
