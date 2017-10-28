import AbstractHandler from './AbstractHandler';

class MessageDeleteHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.MessageDelete.handle(packet.d);
  }
}

export default MessageDeleteHandler;
