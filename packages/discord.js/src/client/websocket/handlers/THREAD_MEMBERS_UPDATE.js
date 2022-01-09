'use strict';

module.exports = (client, packet) => {
  client.actions.ThreadMembersUpdate.handle(packet.d);
};
