'use strict';

const Action = require('./Action');
const Channel = require('../../structures/Channel');
const { ChannelTypes } = require('../../util/Constants');

class ChannelUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    let channel = client.channels.cache.get(data.id);
    if (channel) {
      const old = channel._update(data);

      if (ChannelTypes[channel.type] !== data.type) {
        const newChannel = Channel.create(this.client, data, channel.guild);
        for (const [id, message] of channel.messages.cache) newChannel.messages.cache.set(id, message);
        this.client.channels.cache.set(channel.id, channel);
      }

      return {
        old,
        updated: channel,
      };
    } else {
      client.channels._add(data);
    }

    return {};
  }
}

module.exports = ChannelUpdateAction;
