'use strict';

const { Events } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  const channel = client.channels.cache.get(data.channel_id);
  const user = client.users.cache.get(data.user_id);
  const timestamp = new Date(data.timestamp * 1000);

  if (channel && user) {
    if (channel.type === 'voice') {
      client.emit(Events.WARN, `Discord sent a typing packet to a voice channel ${channel.id}`);
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
};

function tooLate(channel, user) {
  return channel.client.setTimeout(() => {
    channel._typing.delete(user.id);
  }, 10000);
}
