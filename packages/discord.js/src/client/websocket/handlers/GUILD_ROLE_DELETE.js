export default (client, packet) => {
  client.actions.GuildRoleDelete.handle(packet.d);
};
