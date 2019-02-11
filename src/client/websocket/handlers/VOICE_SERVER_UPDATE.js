'use strict';

module.exports = (client, packet) => {
  client.emit('debug', `[VOICE] received voice server: ${JSON.stringify(packet)}`);
  client.emit('self.voiceServer', packet.d);
};
