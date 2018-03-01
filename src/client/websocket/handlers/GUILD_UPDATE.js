module.exports = (client, packet) => {
  client.actions.GuildUpdate.handle(packet.d);
};
