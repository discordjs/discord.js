import AbstractHandler from './AbstractHandler';

class ChannelCreateHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.ChannelCreate.handle(packet.d);
  }
}

export default ChannelCreateHandler;

/**
 * Emitted whenever a channel is created.
 * @event Client#channelCreate
 * @param {DMChannel|GroupDMChannel|GuildChannel} channel The channel that was created
 */
