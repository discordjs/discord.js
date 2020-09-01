'use strict';

const { Events } = require('../../../util/Constants');
const textBasedChannelTypes = ['dm', 'text', 'news'];

module.exports = (client, { d: data }) => {
  let channel = client.channels.cache.get(data.channel_id);
  let user = client.channels.cache.get(data.user_id);

  if (!channel || !user) {
    client.channels.fetch(data.channel_id).then(rChannel => {
      channel = rChannel;
      client.users.fetch(data.user_id).then(rUser => {
        user = rUser;
        triggerEvent(channel, user, data, client);
      });
    });
  } else {
    triggerEvent(channel, user, data, client);
  }
};

function triggerEvent(channel, user, data, client) {
  const timestamp = new Date(data.timestamp * 1000);

  if (channel && user) {
    if (!textBasedChannelTypes.includes(channel.type)) {
      client.emit(Events.WARN, `Discord sent a typing packet to a ${channel.type} channel ${channel.id}`);
      return;
    }

    if (channel._typing.has(user.id)) {
      const typing = channel._typing.get(user.id);

      typing.lastTimestamp = timestamp;
      typing.elapsedTime = Date.now() - typing.since;
      client.clearTimeout(typing.timeout);
      typing.timeout = tooLate(channel, user);
    } else {
      const since = new Date();
      const lastTimestamp = new Date();
      channel._typing.set(user.id, {
        user,
        since,
        lastTimestamp,
        elapsedTime: Date.now() - since,
        timeout: tooLate(channel, user),
      });

      /**
       * Emitted whenever a user starts typing in a channel.
       * @event Client#typingStart
       * @param {Channel} channel The channel the user started typing in
       * @param {User} user The user that started typing
       */
      client.emit(Events.TYPING_START, channel, user);
    }
  }
}

function tooLate(channel, user) {
  return channel.client.setTimeout(() => {
    channel._typing.delete(user.id);
  }, 10000);
}
