const AbstractHandler = require('./AbstractHandler');

class ChannelUpdateHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    client.actions.ChannelUpdate.handle(data);
  }

}

module.exports = ChannelUpdateHandler;
