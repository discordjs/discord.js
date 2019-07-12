'use strict';

module.exports = (client, packet) => {
  client.actions.ChannelDelete.handle(packet.d);
};
