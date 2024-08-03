'use strict';

const Action = require('./Action');

class WebhooksUpdate extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.cache.get(data.channel_id);
    if (!channel) return;

    // TODO: change to Events.WebhooksUpdate in the next major version
    /**
     * Emitted whenever a channel has its webhooks changed.
     * @event Client#webhooksUpdate
     * @param {TextChannel|NewsChannel|VoiceChannel|StageChannel|ForumChannel|MediaChannel} channel
     * The channel that had a webhook update
     */
    client.emit('webhooksUpdate', channel);
  }
}

module.exports = WebhooksUpdate;
