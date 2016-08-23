const AbstractHandler = require('./AbstractHandler');

class GuildRoleUpdateHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    client.actions.GuildRoleUpdate.handle(data);
  }

}

module.exports = GuildRoleUpdateHandler;
