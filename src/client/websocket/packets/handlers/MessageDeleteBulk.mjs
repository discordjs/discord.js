import AbstractHandler from './AbstractHandler';

class MessageDeleteBulkHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.MessageDeleteBulk.handle(packet.d);
  }
}

export default MessageDeleteBulkHandler;
