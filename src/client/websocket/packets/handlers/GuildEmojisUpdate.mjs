import AbstractHandler from './AbstractHandler';

class GuildEmojisUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildEmojisUpdate.handle(data);
  }
}

export default GuildEmojisUpdate;
