module.exports = (client, data) => {
  client.actions.VoiceStateUpdate.handle(data);
};
