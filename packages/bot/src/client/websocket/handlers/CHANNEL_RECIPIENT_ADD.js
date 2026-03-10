'use strict';

const { Events } = require('../../../util/Events.js');
const { Status } = require('../../../util/Status.js');

module.exports = (client, { d: data }) => {
  const channel = client.channels.cache.get(data.channel_id);
  if (!channel) return;

  if (!channel._recipients) channel._recipients = [];
  channel._recipients.push(data.user);
  const user = client.users._add(data.user);

  if (client.status === Status.Ready) {
    /**
     * Emitted when a recipient is added to a group DM.
     *
     * @event Client#channelRecipientAdd
     * @param {Channel} channel The group DM channel
     * @param {User} user The user added
     */
    client.emit(Events.ChannelRecipientAdd, channel, user);
  }
};
