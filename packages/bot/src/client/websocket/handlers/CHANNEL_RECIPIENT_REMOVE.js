'use strict';

const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const channel = client.channels.cache.get(data.channel_id);
  if (!channel) return;

  if (channel._recipients) {
    channel._recipients = channel._recipients.filter(recipient => recipient.id !== data.user.id);
  }

  const user = client.users._add(data.user);

  /**
   * Emitted when a recipient is removed from a group DM.
   *
   * @event Client#channelRecipientRemove
   * @param {Channel} channel The group DM channel
   * @param {User} user The user removed
   */
  client.emit(Events.ChannelRecipientRemove, channel, user);
};
