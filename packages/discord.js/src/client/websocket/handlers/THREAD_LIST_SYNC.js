'use strict';

module.exports = (client, packet) => {
  client.actions.ThreadListSync.handle(packet.d);
};
