'use strict';

module.exports = (client, packet) => {
  client.actions.VoiceChannelEffectSend.handle(packet.d);
};
