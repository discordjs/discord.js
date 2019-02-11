'use strict';

module.exports = (client, packet) => {
  client.emit('debug', `[VOICE] received voice server: ${JSON.stringify(packet)}`);
  client.voice.onVoiceServer(packet.d);
};
