export default (client, packet) => {
  client.actions.MessageReactionRemoveEmoji.handle(packet.d);
};
