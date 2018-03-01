module.exports = (client, packet) => {
  client.actions.GuildRoleUpdate.handle(packet.d);
};
