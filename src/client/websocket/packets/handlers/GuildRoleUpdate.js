const AbstractHandler = require('./AbstractHandler');

class GuildRoleUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildRoleUpdate.handle(data);
  }
}

module.exports = GuildRoleUpdateHandler;
