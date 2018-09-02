const AbstractHandler = require('./AbstractHandler');
const { Events } = require('../../../../util/Constants');

class WebhooksUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const channel = client.channels.get(data.channel_id);
    if (channel) client.emit(Events.WEBHOOKS_UPDATE, channel);
  }
}

/**
 * Emitted whenever a guild text channel has its webhooks changed.
 * @event Client#webhookUpdate
 * @param {TextChannel} channel The channel that had a webhook update
 */

module.exports = WebhooksUpdate;
