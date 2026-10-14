export default (client, packet) => {
  client.actions.GuildMemberRemove.handle(packet.d);
};
