export default (client, packet) => {
  client.actions.MessagePollVoteAdd.handle(packet.d);
};
