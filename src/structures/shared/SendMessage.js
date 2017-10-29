const createMessage = require('./CreateMessage');

module.exports = async function sendMessage(channel, options) { // eslint-disable-line complexity
  const User = require('../User');
  const GuildMember = require('../GuildMember');
  if (channel instanceof User || channel instanceof GuildMember) return channel.createDM().then(dm => dm.send(options));

  const { data, files } = await createMessage(channel, options);

  return channel.client.api.channels[channel.id].messages.post({ data, files })
    .then(d => channel.client.actions.MessageCreate.handle(d).message);
};
