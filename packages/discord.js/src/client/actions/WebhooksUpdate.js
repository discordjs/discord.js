'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class WebhooksUpdate extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.cache.get(data.channel_id);
    if (!channel) return;

    /**
     * Emitted whenever a channel has its webhooks changed.
     * @event Client#webhooksUpdate
     * @param {TextChannel|AnnouncementChannel|VoiceChannel|StageChannel|ForumChannel|MediaChannel} channel
     * The channel that had a webhook update
     */
    client.emit(Events.WebhooksUpdate, channel);
  }
}

module.exports = WebhooksUpdate;
