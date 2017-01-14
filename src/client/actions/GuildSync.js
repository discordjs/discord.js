const Action = require('./Action');

class GuildSync extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.id);
    if (guild) {
      if (data.presences) {
        for (const presence of data.presences) guild._setPresence(presence.user.id, presence);
      }

      if (data.members) {
        for (const syncMember of data.members) {
          const member = guild.members.get(syncMember.user.id);
          if (member) {
            guild._updateMember(member, syncMember);
          } else {
            guild._addMember(syncMember, false);
          }
        }
      }

      if ('large' in data) guild.large = data.large;
    }
  }
}

module.exports = GuildSync;
