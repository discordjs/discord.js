const AbstractHandler = require('./AbstractHandler');

class GuildUpdateHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    client.actions.GuildUpdate.handle(data);
  }

}

module.exports = GuildUpdateHandler;
