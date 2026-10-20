export default (client, packet) => {
  client.actions.GuildStickersUpdate.handle(packet.d);
};
