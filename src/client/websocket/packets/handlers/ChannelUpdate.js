const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class ChannelUpdateHandler extends AbstractHandler {
  handle(packet) {
    const { old, updated } = this.packetManager.client.actions.ChannelUpdate.handle(packet.d);
    if (old && updated) {
      this.packetManager.client.emit(Constants.Events.CHANNEL_UPDATE, old, updated);
    }
  }
}

module.exports = ChannelUpdateHandler;

/**
 * Emitted whenever a channel is updated - e.g. name change, topic change.
 * @event Client#channelUpdate
 * @param {Channel} oldChannel The channel before the update
 * @param {Channel} newChannel The channel after the update
 */
