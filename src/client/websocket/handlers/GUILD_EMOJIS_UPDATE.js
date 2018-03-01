module.exports = (client, packet) => {
  client.actions.GuildEmojisUpdate.handle(packet.d);
};
