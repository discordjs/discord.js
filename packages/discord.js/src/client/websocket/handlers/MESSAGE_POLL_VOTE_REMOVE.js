export default (client, packet) => {
  client.actions.MessagePollVoteRemove.handle(packet.d);
};
