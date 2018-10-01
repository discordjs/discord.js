const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

/*
{ t: 'CHANNEL_PINS_UPDATE',
  s: 666,
  op: 0,
  d:
   { last_pin_timestamp: '2016-08-28T17:37:13.171774+00:00',
     channel_id: '314866471639044027' } }
*/

class ChannelPinsUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const channel = client.channels.get(data.channel_id);
    const time = new Date(data.last_pin_timestamp);
    if (channel && time) {
      // Discord sends null for last_pin_timestamp if the last pinned message was removed
      channel.lastPinTimestamp = time.getTime() || null;

      client.emit(Constants.Events.CHANNEL_PINS_UPDATE, channel, time);
    }
  }
}

/**
 * Emitted whenever the pins of a channel are updated. Due to the nature of the WebSocket event, not much information
 * can be provided easily here - you need to manually check the pins yourself.
 * <warn>The `time` parameter will be a Unix Epoch Date object when there are no pins left.</warn>
 * @event Client#channelPinsUpdate
 * @param {Channel} channel The channel that the pins update occured in
 * @param {Date} time The time when the last pinned message was pinned
 */

module.exports = ChannelPinsUpdate;
