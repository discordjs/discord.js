'use strict';

module.exports = (client, packet) => {
  client.actions.ChannelUpdate.handle(packet.d);
};
