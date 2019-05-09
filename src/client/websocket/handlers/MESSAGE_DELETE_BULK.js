'use strict';

module.exports = (client, packet) => {
  client.actions.MessageDeleteBulk.handle(packet.d);
};
