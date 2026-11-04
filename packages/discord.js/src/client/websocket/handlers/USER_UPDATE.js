export default (client, packet) => {
  client.actions.UserUpdate.handle(packet.d);
};
