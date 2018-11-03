module.exports = (client, packet) => {
  client.actions.WebhooksUpdate.handle(packet.d);
};
