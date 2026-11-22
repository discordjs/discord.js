export default (client, packet) => {
  client.actions.StageInstanceUpdate.handle(packet.d);
};
