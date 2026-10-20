export default (client, packet) => {
  client.actions.MessageCreate.handle(packet.d);
};
