'use strict';

const { Events } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  const channel = client.channels.cache.get(data.channel_id);
  const time = data.last_pin_timestamp ? new Date(data.last_pin_timestamp).getTime() : null;

  if (channel) {
    // Discord sends null for last_pin_timestamp if the last pinned message was removed
    channel.lastPinTimestamp = time;

    /**
     * Emitted whenever the pins of a channel are updated. Due to the nature of the WebSocket event,
     * not much information can be provided easily here - you need to manually check the pins yourself.
     * @event Client#channelPinsUpdate
     * @param {TextBasedChannels} channel The channel that the pins update occurred in
     * @param {Date} time The time of the pins update
     */
    client.emit(Events.CHANNEL_PINS_UPDATE, channel, time);
  }
};
