const Action = require('./Action');
const { Events } = require('../../util/Constants');

class WebhooksUpdate extends Action {
  handle(data) {
    const client = this.client;
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
