'use strict';

module.exports = (client, packet) => {
  client.actions.MessageReactionRemoveAll.handle(packet.d);
};
