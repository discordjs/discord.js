'use strict';

module.exports = (client, packet) => {
  client.actions.ServerEmojisUpdate.handle(packet.d);
};
