import AbstractHandler from './AbstractHandler';

class UserUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.UserUpdate.handle(data);
  }
}

export default UserUpdateHandler;
