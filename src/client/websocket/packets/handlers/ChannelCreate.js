const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class ChannelCreateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const { channel } = client.actions.ChannelCreate.handle(data);
    if (channel) client.emit(Constants.Events.CHANNEL_CREATE, channel);
  }
}

/**
 * Emitted whenever a channel is created.
 * @event Client#channelCreate
 * @param {Channel} channel The channel that was created
 */

module.exports = ChannelCreateHandler;
