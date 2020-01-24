const AbstractHandler = require('./AbstractHandler');

class InviteCreateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.InviteCreate.handle(data);
  }
}

module.exports = InviteCreateHandler;
