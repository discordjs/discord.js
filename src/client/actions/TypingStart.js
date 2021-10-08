'use strict';

const Action = require('./Action');
const Typing = require('../../structures/Typing');
const { Events, TextBasedChannelTypes } = require('../../util/Constants');

class TypingStart extends Action {
  handle(data) {
    const channel = this.getChannel(data);
    if (!channel) return;

    if (!TextBasedChannelTypes.includes(channel.type)) {
      this.client.emit(Events.WARN, `Discord sent a typing packet to a ${channel.type} channel ${channel.id}`);
      return;
    }

    const user = this.getUserFromMember(data);
    if (user) {
      /**
       * Emitted whenever a user starts typing in a channel.
       * @event Client#typingStart
       * @param {Typing} typing The typing state
       */
      this.client.emit(Events.TYPING_START, new Typing(channel, user, data));
    }
  }
}

module.exports = TypingStart;
