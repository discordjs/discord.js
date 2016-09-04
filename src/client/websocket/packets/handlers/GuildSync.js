const AbstractHandler = require('./AbstractHandler');

class GuildSyncHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildSync.handle(data);
  }
}

module.exports = GuildSyncHandler;
