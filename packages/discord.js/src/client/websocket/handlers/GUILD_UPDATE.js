export default (client, packet) => {
  client.actions.GuildUpdate.handle(packet.d);
};
