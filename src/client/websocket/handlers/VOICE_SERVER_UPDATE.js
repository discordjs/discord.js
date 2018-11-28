'use strict';

module.exports = (client, packet) => {
  client.emit('self.voiceServer', packet.d);
};
