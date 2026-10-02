export default (client, packet) => {
  client.actions.InteractionCreate.handle(packet.d);
};
