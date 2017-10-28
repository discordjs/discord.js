import AbstractHandler from './AbstractHandler';

class ChannelDeleteHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.ChannelDelete.handle(packet.d);
  }
}

export default ChannelDeleteHandler;
