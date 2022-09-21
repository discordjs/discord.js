'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class WebhooksUpdate extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.cache.get(data.channel_id);
    /**
     * Emitted whenever a channel has its webhooks changed.
     * @event Client#webhookUpdate
     * @param {TextChannel|NewsChannel|VoiceChannel|ForumChannel} channel The channel that had a webhook update
     */
    if (channel) client.emit(Events.WebhooksUpdate, channel);
  }
}

module.exports = WebhooksUpdate;
