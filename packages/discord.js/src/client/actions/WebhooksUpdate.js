'use strict';

const process = require('node:process');
const Action = require('./Action');

let deprecationEmitted = false;

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

    /**
     * Emitted whenever a channel has its webhooks changed.
     * @event Client#webhookUpdate
     * @param {TextChannel|NewsChannel|VoiceChannel|StageChannel|ForumChannel|MediaChannel} channel
     * The channel that had a webhook update
     * @deprecated Use {@link Client#event:webhooksUpdate} instead.
     */
    if (client.emit('webhookUpdate', channel) && !deprecationEmitted) {
      deprecationEmitted = true;
      process.emitWarning('The webhookUpdate event is deprecated. Use webhooksUpdate instead.', 'DeprecationWarning');
    }
  }
}

module.exports = WebhooksUpdate;
