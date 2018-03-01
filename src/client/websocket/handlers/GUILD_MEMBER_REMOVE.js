module.exports = (client, packet) => {
  client.actions.GuildMemberRemove.handle(packet.d);
};
