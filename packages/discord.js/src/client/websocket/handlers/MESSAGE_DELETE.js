export default (client, packet) => {
  client.actions.MessageDelete.handle(packet.d);
};
