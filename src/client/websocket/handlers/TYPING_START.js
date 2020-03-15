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
      typing.resetTimeout(tooLate(channel, user));
    } else {
      channel._typing.set(user.id, new TypingData(client, timestamp, tooLate(channel, user)));

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

/**
 * Instance which keeps track of how long a user has been typing for.
 */
class TypingData {
  /**
   * @param {Client} client - The client keeping track of this data
   * @param {Date} since - The timestamp ever since the user started typing
   * @param {NodeJS.Timeout} _timeout - The timeout to configure
   */
  constructor(client, since, _timeout) {
    this.since = this.lastTimestamp = since;

    this._timeout = _timeout;

    Object.defineProperty(this, 'client', { value: client });
  }

  resetTimeout(_timeout) {
    this.client.clearTimeout(this._timeout);
    this._timeout = _timeout;
  }

  get elapsedTime() {
    return Date.now() - this.since - 3000;
  }
}

function tooLate(channel, user) {
  return channel.client.setTimeout(() => {
    /**
     * Emitted whenever a user stops typing in a channel.
     * @event Client#typingStop
     * @param {Channel} channel The channel the user was typing in.
     * @param {User} user The user that was typing.
     */
    channel.client.emit(Events.TYPING_STOP, channel, user, channel._typing.get(user.id));
    channel._typing.delete(user.id);
  }, 10000);
}
