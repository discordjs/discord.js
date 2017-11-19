const AbstractHandler = require('./AbstractHandler');

class ChannelUpdateHandler extends AbstractHandler {
  handle(packet) {
    const { old, updated } = this.packetManager.client.actions.ChannelUpdate.handle(packet.d);
    if (old && updated) {
      this.packetManager.client.emit(Events.CHANNEL_UPDATE, old, updated);
    }
  }
}

module.exports = ChannelUpdateHandler;

const { Constants: { Events } } = require('../../../../');

/**
 * Emitted whenever a channel is updated - e.g. name change, topic change.
 * @event Client#channelUpdate
 * @param {DMChannel|GroupDMChannel|GuildChannel} oldChannel The channel before the update
 * @param {DMChannel|GroupDMChannel|GuildChannel} newChannel The channel after the update
 */
