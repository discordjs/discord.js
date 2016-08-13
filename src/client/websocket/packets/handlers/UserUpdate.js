const AbstractHandler = require('./AbstractHandler');

class UserUpdateHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    client.actions.UserUpdate.handle(data);
  }

}

module.exports = UserUpdateHandler;
