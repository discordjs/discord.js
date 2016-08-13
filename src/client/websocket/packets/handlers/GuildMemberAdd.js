// ##untested handler##

const AbstractHandler = require('./AbstractHandler');

class GuildMemberAddHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    const guild = client.store.get('guilds', data.guild_id);

    if (guild) {
      guild._addMember(data);
    }
  }

}

module.exports = GuildMemberAddHandler;
