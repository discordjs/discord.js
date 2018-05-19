module.exports = (client, packet) => {
  client.actions.PresenceUpdate.handle(packet.d);
};
