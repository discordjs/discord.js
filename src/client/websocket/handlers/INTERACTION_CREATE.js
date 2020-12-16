'use strict';

module.exports = (client, packet) => {
    console.log(packet)
  client.actions.inteactionCreate.handle(packet.d);
};
