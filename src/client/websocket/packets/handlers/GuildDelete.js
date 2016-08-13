const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class GuildDeleteHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    const response = client.actions.GuildDelete.handle(data);

    if (response.guild) {
      client.emit(Constants.Events.GUILD_DELETE, response.guild);
    }
  }

}

module.exports = GuildDeleteHandler;
