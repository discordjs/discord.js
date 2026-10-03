export default (client, packet) => {
  client.actions.ThreadMembersUpdate.handle(packet.d);
};
