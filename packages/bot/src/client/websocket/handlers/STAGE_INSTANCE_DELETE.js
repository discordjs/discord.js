'use strict';

module.exports = (client, packet) => {
  client.actions.StageInstanceDelete.handle(packet.d);
};
