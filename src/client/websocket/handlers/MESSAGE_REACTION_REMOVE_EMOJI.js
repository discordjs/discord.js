'use strict';

module.exports = (client, packet) => {
  client.actions.MessageReactionRemoveEmoji.handle(packet.d);
};
