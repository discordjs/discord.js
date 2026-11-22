export default (client, packet) => {
  client.actions.StageInstanceDelete.handle(packet.d);
};
