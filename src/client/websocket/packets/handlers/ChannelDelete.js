const AbstractHandler = require('./AbstractHandler');

const Constants = require('../../../../util/Constants');

class ChannelDeleteHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const response = client.actions.ChannelDelete.handle(data);
    if (response.channel) client.emit(Constants.Events.CHANNEL_DELETE, response.channel);
  }
}

/**
 * Emitted whenever a channel is deleted.
 * @event Client#channelDelete
 * @param {Channel} channel The channel that was deleted
 */

module.exports = ChannelDeleteHandler;
