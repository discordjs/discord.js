export default (client, packet) => {
  client.actions.MessageReactionRemoveAll.handle(packet.d);
};
