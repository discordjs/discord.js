export default (client, packet) => {
  client.actions.ThreadCreate.handle(packet.d);
};
