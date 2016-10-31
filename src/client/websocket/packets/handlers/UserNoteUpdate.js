const AbstractHandler = require('./AbstractHandler');

class UserNoteUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    client.actions.UserNoteUpdate.handle(data);
  }
}

module.exports = UserNoteUpdateHandler;
