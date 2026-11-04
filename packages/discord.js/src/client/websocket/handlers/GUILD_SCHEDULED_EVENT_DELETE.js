export default (client, packet) => {
  client.actions.GuildScheduledEventDelete.handle(packet.d);
};
