const AbstractHandler = require('./AbstractHandler');

class GuildRoleCreateHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    client.actions.GuildRoleCreate.handle(data);
  }

}

module.exports = GuildRoleCreateHandler;
