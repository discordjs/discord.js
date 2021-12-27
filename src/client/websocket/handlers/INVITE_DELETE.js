'use strict';

module.exports = (client, packet) => {
  client.actions.InviteDelete.handle(packet.d);
};
