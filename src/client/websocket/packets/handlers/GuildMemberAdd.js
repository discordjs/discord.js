// ##untested handler##

const AbstractHandler = require('./AbstractHandler');

class GuildMemberAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      guild.memberCount++;
      guild._addMember(data);
    }
  }
}

module.exports = GuildMemberAddHandler;
