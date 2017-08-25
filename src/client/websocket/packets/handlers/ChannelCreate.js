const AbstractHandler = require('./AbstractHandler');

class ChannelCreateHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.ChannelCreate.handle(packet.d);
  }
}

/**
 * Emitted whenever a channel is created.
 * @event Client#channelCreate
 * @param {Channel} channel The channel that was created
 */

module.exports = ChannelCreateHandler;
