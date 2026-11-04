export default (client, packet) => {
  client.actions.GuildMemberUpdate.handle(packet.d);
};
