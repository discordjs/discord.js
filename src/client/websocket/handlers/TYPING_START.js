'use strict';

module.exports = (client, packet) => {
  client.actions.TypingStart.handle(packet.d);
};
