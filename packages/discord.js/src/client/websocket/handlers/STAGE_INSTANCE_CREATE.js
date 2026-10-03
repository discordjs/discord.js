export default (client, packet) => {
  client.actions.StageInstanceCreate.handle(packet.d);
};
