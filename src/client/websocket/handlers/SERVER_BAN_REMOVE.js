'use strict';

module.exports = (client, packet) => {
  client.actions.ServerBanRemove.handle(packet.d);
};
