const AbstractHandler = require('./AbstractHandler');

class InviteDeleteHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.InviteDelete.handle(data);
  }
}

module.exports = InviteDeleteHandler;
