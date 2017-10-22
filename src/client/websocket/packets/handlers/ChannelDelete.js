const AbstractHandler = require('./AbstractHandler');

class ChannelDeleteHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.ChannelDelete.handle(packet.d);
  }
}

module.exports = ChannelDeleteHandler;
