'use strict';

module.exports = (client, packet) => {
  client.actions.ServerDelete.handle(packet.d);
};
