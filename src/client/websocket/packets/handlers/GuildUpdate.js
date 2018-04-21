const AbstractHandler = require('./AbstractHandler');

class GuildUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    data.shard = packet.shard;
    client.actions.GuildUpdate.handle(data);
  }
}

module.exports = GuildUpdateHandler;
