const Action = require('./Action');
const TextChannel = require('../../structures/TextChannel');
const VoiceChannel = require('../../structures/VoiceChannel');
const CategoryChannel = require('../../structures/CategoryChannel');
const NewsChannel = require('../../structures/NewsChannel');
const StoreChannel = require('../../structures/StoreChannel');
const Constants = require('../../util/Constants');
const ChannelTypes = Constants.ChannelTypes;
const Util = require('../../util/Util');

class ChannelUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    let channel = client.channels.get(data.id);
    if (channel) {
      const oldChannel = Util.cloneObject(channel);

      // If the channel is changing types, we need to follow a different process
      if (ChannelTypes[channel.type.toUpperCase()] !== data.type) {
        // Determine which channel class we're changing to
        let channelClass;
        switch (data.type) {
          case ChannelTypes.TEXT:
            channelClass = TextChannel;
            break;
          case ChannelTypes.VOICE:
            channelClass = VoiceChannel;
            break;
          case ChannelTypes.CATEGORY:
            channelClass = CategoryChannel;
            break;
          case ChannelTypes.NEWS:
            channelClass = NewsChannel;
            break;
          case ChannelTypes.STORE:
            channelClass = StoreChannel;
            break;
        }

        // Create the new channel instance and copy over cached data
        const newChannel = new channelClass(channel.guild, data);
        if (channel.messages && newChannel.messages) {
          for (const [id, message] of channel.messages) newChannel.messages.set(id, message);
        }

        channel = newChannel;
        this.client.channels.set(channel.id, channel);
      } else {
        channel.setup(data);
      }

      client.emit(Constants.Events.CHANNEL_UPDATE, oldChannel, channel);
      return {
        old: oldChannel,
        updated: channel,
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
