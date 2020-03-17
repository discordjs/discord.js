'use strict';

const { Events } = require('../../../util/Constants');
let timeout = setTimeout(() => null, 10000);

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
      typing.elapsedTime = getElapsedTime(typing.lastTimestamp, typing.since);
      resetTimeout(client, tooLate(channel, user));
    } else {
      let since = new Date();
      let lastTimestamp = new Date();
      resetTimeout(client, tooLate(channel, user));
      channel._typing.set(user.id, { user, since, lastTimestamp, elapsedTime: getElapsedTime(lastTimestamp, since) });

      /**
       * Emitted whenever a user starts typing in a channel.
       * @event Client#typingStart
       * @param {Channel} channel The channel the user started typing in
       * @param {User} user The user that started typing
       */
      client.emit(Events.TYPING_START, channel, user, channel._typing.get(user.id));
    }
  }
};

function getElapsedTime(since) {
  return Date.now() - since;
}

function resetTimeout(client, _timeout) {
  client.clearTimeout(timeout);
  timeout = _timeout;
}

function tooLate(channel, user) {
  return channel.client.setTimeout(() => {
    channel._typing.get(user.id).elapsedTime = getElapsedTime(channel._typing.get(user.id).since) - 3000;
    channel._typing.delete(user.id);
  }, 10000);
}
