import AbstractHandler from './AbstractHandler';

class MessageCreateHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.MessageCreate.handle(packet.d);
  }
}

export default MessageCreateHandler;
