export default (client, packet) => {
  client.actions.GuildScheduledEventUserRemove.handle(packet.d);
};
