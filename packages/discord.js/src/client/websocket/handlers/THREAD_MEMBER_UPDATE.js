'use strict';

module.exports = (client, packet) => {
  client.actions.ThreadMemberUpdate.handle(packet.d);
};
