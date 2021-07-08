'use strict';

const Action = require('./Action');
const DMChannel = require('../../structures/DMChannel');
const { Events } = require('../../util/Constants');

class ChannelDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;
    const channel = client.channels.cache.get(data.id);

    if (channel) {
      client.channels._remove(channel.id);
      channel.deleted = true;
      if (channel.messages && !(channel instanceof DMChannel)) {
        for (const message of channel.messages.cache.values()) {
          message.deleted = true;
        }
      }
      /**
       * Emitted whenever a channel is deleted.
       * @event Client#channelDelete
       * @param {DMChannel|GuildChannel} channel The channel that was deleted
       */
      client.emit(Events.CHANNEL_DELETE, channel);
    }

    return { channel };
  }
}

module.exports = ChannelDeleteAction;
