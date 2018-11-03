module.exports = (client, packet) => {
  client.actions.VoiceStateUpdate.handle(packet.d);
};
