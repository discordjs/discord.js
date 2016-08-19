// ##untested handler##

const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class GuildBanAddHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    const guild = client.guilds.get(data.guild_id);
    const user = client.users.get(data.user.id);

    if (guild && user) {
      client.emit(Constants.Events.GUILD_BAN_ADD, guild, user);
    }
  }

}

module.exports = GuildBanAddHandler;
