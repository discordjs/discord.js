'use strict';

module.exports = (client, packet) => {
  client.actions.MessageCreate.handle(packet.d);
};
