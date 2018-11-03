module.exports = (client, packet) => {
  client.actions.MessageReactionRemove.handle(packet.d);
};
