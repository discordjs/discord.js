'use strict';

module.exports = (client, packet) => {
  client.actions.InteractionCreate.handle(packet.d);
};
