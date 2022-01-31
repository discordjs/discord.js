'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class ChannelCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const existing = client.channels.cache.has(data.id);
    const channel = client.channels._add(data);
    if (!existing && channel) {
      /**
       * Emitted whenever a guild channel is created.
       * @event Client#channelCreate
       * @param {GuildChannel} channel The channel that was created
       */
      client.emit(Events.ChannelCreate, channel);
    }
    return { channel };
  }
}

module.exports = ChannelCreateAction;
