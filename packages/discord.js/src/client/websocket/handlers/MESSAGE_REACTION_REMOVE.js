export default (client, packet) => {
  client.actions.MessageReactionRemove.handle(packet.d);
};
