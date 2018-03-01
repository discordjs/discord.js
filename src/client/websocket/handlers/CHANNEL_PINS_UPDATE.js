const { Events } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  const channel = client.channels.get(data.channel_id);
  const time = new Date(data.last_pin_timestamp);
  /**
   * Emitted whenever the pins of a channel are updated. Due to the nature of the WebSocket event, not much information
   * can be provided easily here - you need to manually check the pins yourself.
   * @event Client#channelPinsUpdate
   * @param {DMChannel|GroupDMChannel|TextChannel} channel The channel that the pins update occured in
   * @param {Date} time The time of the pins update
   */
  if (channel && time) client.emit(Events.CHANNEL_PINS_UPDATE, channel, time);
};
