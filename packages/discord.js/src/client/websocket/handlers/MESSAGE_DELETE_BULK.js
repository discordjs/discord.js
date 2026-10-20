export default (client, packet) => {
  client.actions.MessageDeleteBulk.handle(packet.d);
};
