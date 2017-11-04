const createMessage = require('./CreateMessage');

module.exports = async function sendMessage(channel, options) { // eslint-disable-line complexity
  const User = require('../User');
  const GuildMember = require('../GuildMember');
  if (channel instanceof User || channel instanceof GuildMember) return channel.createDM().then(dm => dm.send(options));

  const { data, files } = await createMessage(channel, options);

  if (data.content instanceof Array) {
    const messages = [];
    for (let i = 0; i < data.content.length; i++) {
      const opt = i === data.content.length - 1 ? { tts: data.tts, embed: data.embed, files } : { tts: data.tts };
      // eslint-disable-next-line no-await-in-loop
      const message = await channel.send(data.content[i], opt);
      messages.push(message);
    }
    return messages;
  }

  return channel.client.api.channels[channel.id].messages.post({ data, files })
    .then(d => channel.client.actions.MessageCreate.handle(d).message);
};
