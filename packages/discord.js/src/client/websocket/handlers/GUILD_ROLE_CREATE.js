export default (client, packet) => {
  client.actions.GuildRoleCreate.handle(packet.d);
};
