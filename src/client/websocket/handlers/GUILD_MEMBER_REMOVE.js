module.exports = (client, packet, shard) => {
  client.actions.GuildMemberRemove.handle(packet.d, shard);
};
