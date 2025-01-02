'use strict';

const Action = require('./Action');
const { createChannel } = require('../../util/Channels');
const Events = require('../../util/Events');

class ChannelUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    let channel = client.channels.cache.get(data.id);

    if (channel) {
      const old = channel._update(data);

      if (channel.type !== data.type) {
        const newChannel = createChannel(this.client, data, channel.guild);

        if (!newChannel) {
          this.client.channels.cache.delete(channel.id);
          return {};
        }

        if (channel.isTextBased() && newChannel.isTextBased()) {
          for (const [id, message] of channel.messages.cache) newChannel.messages.cache.set(id, message);
        }

        channel = newChannel;
        this.client.channels.cache.set(channel.id, channel);
      }

      if (channel.isThread()) {
        /**
         * Emitted whenever a thread is updated - e.g. name change, archive state change, locked state change.
         * @event Client#threadUpdate
         * @param {ThreadChannel} oldThread The thread before the update
         * @param {ThreadChannel} newThread The thread after the update
         */
        client.emit(Events.ThreadUpdate, old, channel);
      } else {
        /**
         * Emitted whenever a channel is updated - e.g. name change, topic change, channel type change.
         * @event Client#channelUpdate
         * @param {DMChannel|GuildChannel} oldChannel The channel before the update
         * @param {DMChannel|GuildChannel} newChannel The channel after the update
         */
        this.client.emit(Events.ChannelUpdate, old, channel);
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
