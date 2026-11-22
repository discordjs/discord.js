export default (client, packet) => {
  client.actions.GuildScheduledEventUserAdd.handle(packet.d);
};
