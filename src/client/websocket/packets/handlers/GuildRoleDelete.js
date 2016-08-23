const AbstractHandler = require('./AbstractHandler');

class GuildRoleDeleteHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    client.actions.GuildRoleDelete.handle(data);
  }

}

module.exports = GuildRoleDeleteHandler;
