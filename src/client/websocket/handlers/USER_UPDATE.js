'use strict';

module.exports = (client, packet) => {
  client.actions.UserUpdate.handle(packet.d);
};
