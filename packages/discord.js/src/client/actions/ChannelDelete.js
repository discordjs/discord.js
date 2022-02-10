'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class ChannelDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.cache.get(data.id);

    if (channel) {
      client.channels._remove(channel.id);
      /**
       * Emitted whenever a channel is deleted.
       * @event Client#channelDelete
       * @param {DMChannel|GuildChannel} channel The channel that was deleted
       */
      client.emit(Events.ChannelDelete, channel);
    }
  }
}

module.exports = ChannelDeleteAction;
