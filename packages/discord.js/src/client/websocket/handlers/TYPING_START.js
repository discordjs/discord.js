export default (client, packet) => {
  client.actions.TypingStart.handle(packet.d);
};
