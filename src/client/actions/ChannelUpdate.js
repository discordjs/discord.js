'use strict';

const Action = require('./Action');
const Channel = require('../../structures/Channel');
const MessageStore = require('../../stores/MessageStore');
const { ChannelTypes } = require('../../util/Constants');

class ChannelUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    let channel = client.channels.get(data.id);
    if (channel) {
      const old = channel._update(data);

      if (ChannelTypes[channel.type.toUpperCase()] !== data.type) {
        const newChannel = Channel.create(this.client, data, channel.guild);
        newChannel.messages = new MessageStore(newChannel);
        for (const [id, message] of channel.messages) newChannel.messages.set(id, message);
        newChannel._typing = new Map(channel._typing);
        channel = newChannel;
        this.client.channels.set(channel.id, channel);
      }

      return {
        old,
        updated: channel,
      };
    }

    return {};
  }
}

module.exports = ChannelUpdateAction;
