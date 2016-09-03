const AbstractHandler = require('./AbstractHandler');

class GuildSyncHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    client.actions.GuildSync.handle(data);
  }

}

module.exports = GuildSyncHandler;
