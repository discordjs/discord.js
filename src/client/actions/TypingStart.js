'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');
const textBasedChannelTypes = ['dm', 'text', 'news'];

class TypingStart extends Action {
  handle(data) {
    const channel = this.getChannel(data);
    if (!channel) {
      return;
    }
    if (!textBasedChannelTypes.includes(channel.type)) {
      this.client.emit(Events.WARN, `Discord sent a typing packet to a ${channel.type} channel ${channel.id}`);
      return;
    }

    const user = this.getUserFromMember(data);
    const timestamp = new Date(data.timestamp * 1000);

    if (channel && user) {
      if (channel._typing.has(user.id)) {
        const typing = channel._typing.get(user.id);

        typing.lastTimestamp = timestamp;
        typing.elapsedTime = Date.now() - typing.since;
        this.client.clearTimeout(typing.timeout);
        typing.timeout = this.tooLate(channel, user);
      } else {
        const since = new Date();
        const lastTimestamp = new Date();
        channel._typing.set(user.id, {
          user,
          since,
          lastTimestamp,
          elapsedTime: Date.now() - since,
          timeout: this.tooLate(channel, user),
        });

        /**
         * Emitted whenever a user starts typing in a channel.
         * @event Client#typingStart
         * @param {Channel} channel The channel the user started typing in
         * @param {User} user The user that started typing
         */
        this.client.emit(Events.TYPING_START, channel, user);
      }
    }
  }

  tooLate(channel, user) {
    return channel.client.setTimeout(() => {
      channel._typing.delete(user.id);
    }, 10000);
  }
}

module.exports = TypingStart;
