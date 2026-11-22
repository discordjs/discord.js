export default (client, { d: data }) => {
  client.actions.GuildSoundboardSoundDelete.handle(data);
};
