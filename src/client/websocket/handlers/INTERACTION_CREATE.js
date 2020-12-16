'use strict';

module.exports = (client, packet) => {
    console.log(packet)
  client.actions.InteractionCreate.handle(packet.d);
};
