// ##untested handler##

const AbstractHandler = require('./AbstractHandler');

class GuildMemberUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const member = guild.members.get(data.user.id);
      if (member) guild._updateMember(member, data);
    }
  }
}

module.exports = GuildMemberUpdateHandler;
