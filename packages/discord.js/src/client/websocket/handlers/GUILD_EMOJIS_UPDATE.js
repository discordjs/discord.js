export default (client, packet) => {
  client.actions.GuildEmojisUpdate.handle(packet.d);
};
