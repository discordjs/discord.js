const AbstractHandler = require('./AbstractHandler');

class ChannelUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.ChannelUpdate.handle(data);
  }
}

module.exports = ChannelUpdateHandler;
