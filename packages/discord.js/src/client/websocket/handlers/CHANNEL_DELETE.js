export default (client, packet) => {
  client.actions.ChannelDelete.handle(packet.d);
};
