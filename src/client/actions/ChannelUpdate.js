const Action = require('./Action');
const Constants = require('../../util/Constants');
const Util = require('../../util/Util');

class ChannelUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.id);
    if (channel) {
      const old = channel._update(data);
      client.emit(Constants.Events.CHANNEL_UPDATE, old, channel);
      return {
        old,
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
