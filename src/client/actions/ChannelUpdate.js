const Action = require('./Action');
const Constants = require('../../util/Constants');
const GuildChannel = require('../../structures/GuildChannel');

class ChannelUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.id);
    if (channel) {
      const newChannel = new GuildChannel(channel.guild, data);
      client.emit(Constants.Events.CHANNEL_UPDATE, channel, newChannel);
      channel.guild.channels.set(newChannel.id, newChannel);
      this.client.channels.set(newChannel.id, newChannel);
      return {
        old: channel,
        updated: newChannel,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

/**
 * Emitted whenever a channel is updated - e.g. name change, topic change.
 * @event Client#channelUpdate
 * @param {Channel} oldChannel The channel before the update
 * @param {Channel} newChannel The channel after the update
 */

module.exports = ChannelUpdateAction;
