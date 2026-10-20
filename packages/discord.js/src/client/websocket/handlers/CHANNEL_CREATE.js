export default (client, packet) => {
  client.actions.ChannelCreate.handle(packet.d);
};
