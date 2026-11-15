export default (client, packet) => {
  client.actions.MessageReactionAdd.handle(packet.d);
};
